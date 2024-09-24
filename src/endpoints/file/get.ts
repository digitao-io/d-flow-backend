import {
  Configuration,
  Context,
  WrappedHandler,
  HandlerError,
} from "../../main";
import {
  FileDatabase,
  FileIdentifier,
  fileIdentifierValidation,
  FileResponse,
} from "./model";

export const fileGet: WrappedHandler<
  Context<Configuration>,
  Configuration,
  FileIdentifier,
  undefined,
  FileResponse
> = {
  namespace: "site",
  entity: "file",
  operation: "get",

  paramsValidation: fileIdentifierValidation,
  authorizationRequired: true,

  async handle(ctx, { params }) {
    const file = await ctx.database.db().collection("files")
      .findOne<FileDatabase>(
        { key: params.key },
        { projection: { _id: 0 } },
      );

    if (file === null) {
      throw new HandlerError("ENTITY_NOT_FOUND", `File with key ${params.key} doesn't exist`);
    }

    return {
      data: {
        key: file.key,
        description: file.description,
        mimeType: file.mimeType,
        sizeInBytes: file.sizeInBytes,
        createdAt: file.createdAt.toISOString(),
      },
    };
  },
};
