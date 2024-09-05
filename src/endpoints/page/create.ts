import { Configuration, Context, Handler } from "../../main";
import { Page, PageIdentifier } from "./model";

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

  async handle(ctx, input) {
    await ctx.database.db().collection("page").insertOne(input.data);

    return { data: { "key": input.data.key } };
  },
};
