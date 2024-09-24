import { Configuration, Context, WrappedHandler } from "../../main";
import { PageDatabase, PageResponse } from "./model";

export const pageList: WrappedHandler<
  Context<Configuration>,
  Configuration,
  undefined,
  undefined,
  Array<PageResponse>
> = {
  namespace: "site",
  entity: "page",
  operation: "list-all",

  async handle(ctx) {
    const pages = await ctx.database.db().collection("pages")
      .find<PageDatabase>({}, { projection: { _id: 0 } })
      .sort({ key: 1 })
      .toArray();
    const total = await ctx.database.db().collection("pages")
      .countDocuments({});

    return {
      data: pages.map((page) => ({
        key: page.key,
        title: page.title,
        description: page.description,
        urlPattern: page.urlPattern,
        details: page.details,
        createdAt: page.createdAt.toISOString(),
        updatedAt: page.updatedAt.toISOString(),
      })),
      total,
    };
  },
};
