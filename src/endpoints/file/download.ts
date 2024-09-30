import { Configuration, Context } from "../../main";
import { HandlerError, RawHandler, sendError } from "../../app/handler";
import { FileDatabase } from "./model";
import { S3Error } from "minio";

export function fileDownload(ctx: Context<Configuration>): RawHandler {
  return {
    method: "get",
    path: "/site/file/download/:key",
    handle:
      async (req, res) => {
        try {
          const key = req.params["key"];

          const fileDatabase = await ctx.database.db().collection<FileDatabase>("files")
            .findOne({ key });

          if (!fileDatabase) {
            sendError(res, new HandlerError("ENTITY_NOT_FOUND", "File doesn't exist"));
            return;
          }

          const result = await ctx.objstorage.getObject(
            ctx.configuration.objstorage.bucket,
            key,
          );

          const chunks = [] as Uint8Array[];
          const buffer = await new Promise((resolve, reject) => {
            result.on("data", (chunk) => {
              chunks.push(chunk);
            });

            result.on("end", () => {
              const buffer = Buffer.concat(chunks);
              resolve(buffer);
            });

            result.on("error", (err) => {
              reject(err);
            });
          });

          res.status(200);
          res.contentType(fileDatabase.mimeType);
          res.send(buffer);
          res.end();
        }
        catch (err) {
          if (err instanceof S3Error && err.code === "NoSuchKey") {
            sendError(res, new HandlerError("ENTITY_NOT_FOUND", "File doesn't exist"));
          }
          else {
            sendError(res, new HandlerError("INTERNAL_ERROR", "Internal error occurs"));
            console.log(err);
            return;
          }
        }
      },
  };
}
