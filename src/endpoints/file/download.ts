import { Configuration, Context } from "../../main";
import { HandlerError, RawHandler, sendError, sendResponse } from "../../app/handler";
import { FileDatabase } from "./model";

export function fileDownload(ctx: Context<Configuration>): RawHandler {
  return {
    method: "get",
    path: "/site/file/upload/:key",
    handle:
      async (req, res) => {
        const key = req.params["key"];

        const fileDatabase = await ctx.database.db().collection<FileDatabase>("files")
          .findOne({ key });

        if (fileDatabase.key !== key) {
          sendError(res, new HandlerError("ENTITY_NOT_FOUND", "File doesn't exist"));
          return;
        }

        const result = await ctx.objstorage.getObject(
          ctx.configuration.objstorage.bucket,
          key,
        );

        res.status(200);
        res.send(result);
        res.end();
      },
  };
}
