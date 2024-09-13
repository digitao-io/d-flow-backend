import { Configuration, Context, Handler } from "../../main";
import { Page, PageIdentifier } from "./model";

export const pageList: Handler<
  Context<Configuration>,
  Configuration,
  PageIdentifier,
  Page,
  Array<Page>
> = {
  namespace: "site",
  entity: "page",
  operation: "list",

  async handle(ctx) {
    const page = await ctx.database.db().collection<Page>("pages").find({ }, { projection: { _id: 0 } }).toArray();
    return { data: page };
  },
};
