import { Configuration, Context, Handler } from "../../main";
import { Page, PageIdentifier, pageIdentifierValidation } from "./model";

export const pageGet: Handler<
  Context<Configuration>,
  Configuration,
  PageIdentifier,
  Page,
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
    return { data: page };
  },
};
