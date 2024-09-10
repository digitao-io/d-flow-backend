import { Configuration, Context, Handler } from "../../main";
import { PageData, PageIdentifier, pageIdentifierValidation } from "./model";

export const pageUpdate: Handler<
  Context<Configuration>,
  Configuration,
  PageIdentifier,
  PageData,
  PageIdentifier
> = {
  namespace: "site",
  entity: "page",
  operation: "update",

  paramsValidation: pageIdentifierValidation,

  async handle(ctx, { params, data }) {
    await ctx.database.db().collection("pages").updateOne(
      { key: params.key },
      { $set: data },
    );
    return { data: { key: params.key } };
  },
};
