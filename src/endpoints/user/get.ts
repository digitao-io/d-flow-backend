import { Configuration, Context, Handler, HandlerError } from "../../main";
import { User, UserIdentifier, userIdentifierValidation } from "./model";

export const userGet: Handler<
  Context<Configuration>,
  Configuration,
  UserIdentifier,
  undefined,
  User
> = {
  namespace: "site",
  entity: "user",
  operation: "get",

  paramsValidation: userIdentifierValidation,

  async handle(ctx, { params }) {
    const user = await ctx.database.db().collection<User>("users").findOne(
      { username: params.username },
      { projection: { _id: 0 } },
    );
    if (user === null) {
      throw new HandlerError("ENTITY_NOT_FOUND", "The entity was not found.");
    }
    return { data: user };
  },
};
