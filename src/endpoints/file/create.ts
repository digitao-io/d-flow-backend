import {
  Configuration,
  Context,
  Handler,
} from "../../main";
import {
  FileCreate,
  fileCreateValidation,
  FileDatabase,
  FileIdentifier,
} from "./model";

export const fileCreate: Handler<
  Context<Configuration>,
  Configuration,
  undefined,
  FileCreate,
  FileIdentifier
> = {
  namespace: "site",
  entity: "file",
  operation: "create",

  dataValidation: fileCreateValidation,

  async handle(ctx, { data }) {
    const now = new Date();
    const fileDatabase: FileDatabase = {
      key: data.key,
      description: data.description,
      mimeType: data.mimeType,
      sizeInBytes: data.sizeInBytes,
      createdAt: now,
    };

    await ctx.database.db().collection("files")
      .insertOne(fileDatabase);

    return { data: { key: data.key } };
  },
};
