import * as crypto from "crypto";
import { Configuration, Context, Handler, HandlerError } from "../../main";
import { UserUpdate, UserDatabase, UserIdentifier, userIdentifierValidation, userUpdateValidation } from "./model";

export const userUpdate: Handler<
  Context<Configuration>,
  Configuration,
  UserIdentifier,
  UserUpdate,
  UserIdentifier
> = {
  namespace: "site",
  entity: "user",
  operation: "update",

  paramsValidation: userIdentifierValidation,
  dataValidation: userUpdateValidation,
  authorizationRequired: true,

  async handle(ctx, { params, data }) {
    const userDatabase: Partial<UserDatabase> = {
      username: data.username,
      displayName: data.displayName,
      email: data.email,
    };

    if (data.password) {
      userDatabase.passwordHash = crypto.createHash("sha256").update(data.password).digest("hex");
    }

    const updateResult = await ctx.database.db().collection("users")
      .updateOne(
        { username: params.username },
        { $set: userDatabase },
      );

    if (updateResult.modifiedCount < 1) {
      throw new HandlerError("ENTITY_NOT_FOUND", `User with name ${params.username} doesn't exist`);
    }

    return { data: { username: data.username } };
  },
};
