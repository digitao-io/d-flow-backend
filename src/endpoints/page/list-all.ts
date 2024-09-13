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
  operation: "list-all",

  async handle(ctx) {
    const pages = await ctx.database.db().collection("pages")
      .find<Page>({}, { projection: { _id: 0 } })
      .sort({ key: 1 })
      .toArray();
    const total = await ctx.database.db().collection("pages")
      .countDocuments({});

    return {
      data: pages,
      total,
    };
  },
};
