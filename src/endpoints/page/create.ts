import { Configuration, Context, Handler } from "../../main";
import { Page, PageIdentifier, pageValidation } from "./model";

export const pageCreate: Handler<
  Context<Configuration>,
  Configuration,
  undefined,
  Page,
  PageIdentifier
> = {
  namespace: "site",
  entity: "page",
  operation: "create",

  dataValidation: pageValidation,

  async handle(ctx, { data }) {
    await ctx.database.db().collection("pages").insertOne(data);
    return { data: { key: data.key } };
  },
};
