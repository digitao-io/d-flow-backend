import multer from "multer";
import { Configuration, Context } from "../../main";
import { verifyJwt } from "../../app/jwt";
import { HandlerError, RawHandler, sendError, sendResponse } from "../../app/handler";
import { FileDatabase } from "./model";

export function fileUpload(ctx: Context<Configuration>): RawHandler {
  return {
    method: "post",
    path: "/site/file/upload/:key",
    handle: [
      (req, res, next) => {
        const jwtCookie = (req.header("Cookie") ?? "").split(";").find((cookie) => cookie.split("=")[0].trim() === "jwt");

        if (!jwtCookie) {
          sendError(res, new HandlerError("AUTH_FAILED", "Authorization failed"));
          return;
        }

        const token = jwtCookie.split("=")[1].trim();

        if (!verifyJwt(token, ctx.configuration.jwt.serverSecret)) {
          sendError(res, new HandlerError("AUTH_FAILED", "Authorization failed"));
          return;
        }

        next();
      },

      multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: 1024 * 64 },
      }).single("file"),

      async (req, res) => {
        try {
          const key = req.params["key"];
          const mimeType = req.file?.mimetype;
          const sizeInBytes = req.file?.size;
          const buffer = req.file?.buffer;

          const fileDatabase = await ctx.database.db().collection<FileDatabase>("files")
            .findOne({ key });

          if (!fileDatabase) {
            sendError(res, new HandlerError("ENTITY_NOT_FOUND", "File metadata doesn't exist"));
            return;
          }

          if (
            fileDatabase.key !== key
            || fileDatabase.mimeType !== mimeType
            || fileDatabase.sizeInBytes !== sizeInBytes
          ) {
            sendError(res, new HandlerError("INVALID_PARAMS", "Uploaded file doesn't match the file metadata"));
            return;
          }

          if (!buffer) {
            sendError(res, new HandlerError("INVALID_DATA", "Uploaded file doesn't have content"));
            return;
          }

          await ctx.objstorage.putObject(
            ctx.configuration.objstorage.bucket,
            key,
            buffer,
            sizeInBytes,
            { "Content-Type": mimeType },
          );

          sendResponse(res, { data: undefined });
        }
        catch (err) {
          sendError(res, new HandlerError("INTERNAL_ERROR", "Internal error occurs"));
          console.log(err);
          return;
        }
      }],
  };
}
