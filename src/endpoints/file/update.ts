import {
  Configuration,
  Context,
  Handler,
  HandlerError,
} from "../../main";
import {
  FileCreateAndUpdate,
  fileCreateAndUpdateValidation,
  FileDatabase,
  FileIdentifier,
  fileIdentifierValidation,
} from "./model";

export const fileUpdate: Handler<
  Context<Configuration>,
  Configuration,
  FileIdentifier,
  FileCreateAndUpdate,
  FileIdentifier
> = {
  namespace: "site",
  entity: "file",
  operation: "update",

  paramsValidation: fileIdentifierValidation,
  dataValidation: fileCreateAndUpdateValidation,

  async handle(ctx, { params, data }) {
    const now = new Date();
    const fileDatabase: Partial<FileDatabase> = {
      key: data.key,
      description: data.description,
      mimeType: data.mimeType,
      sizeInBytes: data.sizeInBytes,
      createdAt: now,
    };

    const updateResult = await ctx.database.db().collection("files")
      .updateOne(
        { key: params.key },
        { $set: fileDatabase },
      );

    if (updateResult.modifiedCount < 1) {
      throw new HandlerError("ENTITY_NOT_FOUND", `File with key ${params.key} doesn't exist`);
    }

    return { data: { key: data.key } };
  },
};
