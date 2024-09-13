import { Configuration, Context, Handler, HandlerError } from "../../main";
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
    const deleteResult = await ctx.database.db().collection("users")
      .deleteOne({ username: params.username });

    if (deleteResult.deletedCount < 1) {
      throw new HandlerError("ENTITY_NOT_FOUND", `User with name ${params.username} doesn't exist`);
    }

    return { data: { username: params.username } };
  },
};
