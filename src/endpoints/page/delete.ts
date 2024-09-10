import { Configuration, Context, Handler } from "../../main";
import { PageIdentifier, pageIdentifierValidation } from "./model";

export const pageDelete: Handler<
  Context<Configuration>,
  Configuration,
  PageIdentifier,
  undefined,
  PageIdentifier
> = {
  namespace: "site",
  entity: "page",
  operation: "delete",

  paramsValidation: pageIdentifierValidation,

  async handle(ctx, { params }) {
    await ctx.database.db().collection("pages").deleteOne({ key: params.key });
    return { data: { key: params.key } };
  },
};
