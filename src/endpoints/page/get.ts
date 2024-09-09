import { Configuration, Context, Handler } from "../../main";
import { Page, PageIdentifier } from "./model";

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

  async handle(ctx, { params }) {
    const page = await ctx.database.db().collection<Page>("pages").findOne({ params }, { projection: { _id: 0 } });
    return { data: page };
  },
};
