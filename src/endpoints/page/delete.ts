import { Configuration, Context, Handler, HandlerError } from "../../main";
import { PageIdentifier, pageIdentifierValidation } from "./model";

export const pageDelete: Handler<
  Context<Configuration>,
  Configuration,
  PageIdentifier,
  undefined,
  PageIdentifier
> = {
  namespace: "site",
  entity: "page",
  operation: "delete",

  paramsValidation: pageIdentifierValidation,

  async handle(ctx, { params }) {
    const deleteResult = await ctx.database.db().collection("pages")
      .deleteOne({ key: params.key });

    if (deleteResult.deletedCount < 1) {
      throw new HandlerError("ENTITY_NOT_FOUND", `Page with key ${params.key} doesn't exist`);
    }

    return { data: { key: params.key } };
  },
};
