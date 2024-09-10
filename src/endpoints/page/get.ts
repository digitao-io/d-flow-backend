import { Configuration, Context, Handler, HandlerError } from "../../main";
import { Page, PageIdentifier, pageIdentifierValidation } from "./model";

export const pageGet: Handler<
  Context<Configuration>,
  Configuration,
  PageIdentifier,
  undefined,
  Page
> = {
  namespace: "site",
  entity: "page",
  operation: "get",

  paramsValidation: pageIdentifierValidation,

  async handle(ctx, { params }) {
    const page = await ctx.database.db().collection<Page>("pages").findOne(
      { key: params.key },
      { projection: { _id: 0 } },
    );
    if (page === null) {
      throw new HandlerError("ENTITY_NOT_FOUND", "The entity was not found.");
    }
    return { data: page };
  },
};
