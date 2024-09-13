import {
  Configuration,
  Context,
  Handler,
  HandlerError,
} from "../../main";
import {
  PageCreateAndUpdate,
  PageIdentifier,
  pageIdentifierValidation,
  pageCreateAndUpdateValidation,
  PageDatabase,
} from "./model";

export const pageUpdate: Handler<
  Context<Configuration>,
  Configuration,
  PageIdentifier,
  PageCreateAndUpdate,
  PageIdentifier
> = {
  namespace: "site",
  entity: "page",
  operation: "update",

  paramsValidation: pageIdentifierValidation,
  dataValidation: pageCreateAndUpdateValidation,

  async handle(ctx, { params, data }) {
    const now = new Date();
    const pageDatabase: Partial<PageDatabase> = {
      key: data.key,
      title: data.title,
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
