import {
  Configuration,
  Context,
  WrappedHandler,
  HandlerError,
} from "../../main";
import {
  PageRequest,
  PageIdentifier,
  pageIdentifierValidation,
  pageRequestValidation,
  PageDatabase,
} from "./model";

export const pageUpdate: WrappedHandler<
  Context<Configuration>,
  Configuration,
  PageIdentifier,
  PageRequest,
  PageIdentifier
> = {
  namespace: "site",
  entity: "page",
  operation: "update",

  authorizationRequired: true,
  paramsValidation: pageIdentifierValidation,
  dataValidation: pageRequestValidation,

  async handle(ctx, { params, data }) {
    const now = new Date();
    const pageDatabase: Partial<PageDatabase> = {
      key: data.key,
      name: data.name,
      description: data.description,
      urlPattern: data.urlPattern,
      details: data.details,
      updatedAt: now,
    };

    const updateResult = await ctx.database.db().collection("pages")
      .updateOne(
        { key: params.key },
        { $set: pageDatabase },
      );

    if (updateResult.modifiedCount < 1) {
      throw new HandlerError("ENTITY_NOT_FOUND", `Page with key ${params.key} doesn't exist`);
    }

    return { data: { key: data.key } };
  },
};
