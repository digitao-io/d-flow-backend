import {
  Configuration,
  Context,
  Handler,
  HandlerError,
} from "../../main";
import {
  FileUpdate,
  fileUpdateValidation,
  FileDatabase,
  FileIdentifier,
  fileIdentifierValidation,
} from "./model";

export const fileUpdate: Handler<
  Context<Configuration>,
  Configuration,
  FileIdentifier,
  FileUpdate,
  FileIdentifier
> = {
  namespace: "site",
  entity: "file",
  operation: "update",

  paramsValidation: fileIdentifierValidation,
  dataValidation: fileUpdateValidation,

  async handle(ctx, { params, data }) {
    const fileDatabase: Partial<FileDatabase> = {
      key: data.key,
      description: data.description,
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
