import { Configuration, Context, Handler, HandlerError } from "../../main";
import { UserResponse, UserIdentifier, userIdentifierValidation } from "./model";

export const userGet: Handler<
  Context<Configuration>,
  Configuration,
  UserIdentifier,
  undefined,
  UserResponse
> = {
  namespace: "site",
  entity: "user",
  operation: "get",

  paramsValidation: userIdentifierValidation,
  authorizationRequired: true,

  async handle(ctx, { params }) {
    const user = await ctx.database.db().collection("users")
      .findOne<UserResponse | null>(
        { username: params.username },
        { projection: { _id: 0, passwordHash: 0 } },
      );

    if (user === null) {
      throw new HandlerError("ENTITY_NOT_FOUND", `User with name ${params.username} doesn't exist`);
    }

    return { data: user };
  },
};
