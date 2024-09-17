import { Configuration, Context, Handler } from "../../main";
import { FileDatabase, FileResponse } from "./model";

export const fileList: Handler<
  Context<Configuration>,
  Configuration,
  undefined,
  undefined,
  Array<FileResponse>
> = {
  namespace: "site",
  entity: "file",
  operation: "list-all",

  async handle(ctx) {
    const files = await ctx.database.db().collection("files")
      .find<FileDatabase>({}, { projection: { _id: 0 } })
      .sort({ key: 1 })
      .toArray();
    const total = await ctx.database.db().collection("files")
      .countDocuments({});

    return {
      data: files.map((file) => ({
        key: file.key,
        description: file.description,
        mimeType: file.mimeType,
        sizeInBytes: file.sizeInBytes,
        createdAt: file.createdAt.toISOString(),
      })),
      total,
    };
  },
};
