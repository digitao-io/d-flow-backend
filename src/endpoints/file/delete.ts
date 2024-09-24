import {
  Configuration,
  Context,
  WrappedHandler,
  HandlerError,
} from "../../main";
import {
  FileIdentifier,
  fileIdentifierValidation,
} from "./model";

export const fileDelete: WrappedHandler<
  Context<Configuration>,
  Configuration,
  FileIdentifier,
  undefined,
  FileIdentifier
> = {
  namespace: "site",
  entity: "file",
  operation: "delete",

  paramsValidation: fileIdentifierValidation,
  authorizationRequired: true,

  async handle(ctx, { params }) {
    const deleteResult = await ctx.database.db().collection("files")
      .deleteOne({ key: params.key });

    if (deleteResult.deletedCount < 1) {
      throw new HandlerError("ENTITY_NOT_FOUND", `File with key ${params.key} doesn't exist`);
    }

    return { data: { key: params.key } };
  },
};
