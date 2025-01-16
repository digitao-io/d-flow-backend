import {
  Configuration,
  Context,
  WrappedHandler,
  HandlerError,
} from "../../main";
import {
  FileUpdate,
  fileUpdateValidation,
  FileDatabase,
  FileIdentifier,
  fileIdentifierValidation,
} from "./model";

export const fileUpdate: WrappedHandler<
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
  authorizationRequired: true,

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

    await ctx.objstorage.copyObject(
      ctx.configuration.objstorage.bucket,
      data.key,
      `/${ctx.configuration.objstorage.bucket}/${params.key}`,
    );

    await ctx.objstorage.removeObject(
      ctx.configuration.objstorage.bucket,
      params.key,
    );

    return { data: { key: data.key } };
  },
};
