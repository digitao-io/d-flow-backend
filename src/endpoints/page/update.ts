import { Configuration, Context, Handler } from "../../main";
import { PageData, PageIdentifier } from "./model";

export const PageUpdate: Handler<
  Context<Configuration>,
  Configuration,
  PageIdentifier,
  PageData,
  PageIdentifier
> = {
  namespace: "site",
  entity: "page",
  operation: "update",

  async handle(ctx, { params, data }) {
    await ctx.database.db().collection("pages").updateOne(params, data);
    return { data: { key: params.key } };
  },
};
