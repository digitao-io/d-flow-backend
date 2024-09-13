import { Configuration, Context, Handler } from "../../main";
import { UserIdentifier, userIdentifierValidation } from "./model";

export const userDelete: Handler<
  Context<Configuration>,
  Configuration,
  UserIdentifier,
  undefined,
  UserIdentifier
> = {
  namespace: "site",
  entity: "user",
  operation: "delete",

  paramsValidation: userIdentifierValidation,

  async handle(ctx, { params }) {
    await ctx.database.db().collection("users").deleteOne({ username: params.username });
    return { data: { username: params.username } };
  },
};
