import { Configuration, Context, Handler } from "../../main";
import { UserCreate, UserDatabase, UserIdentifier, userCreateValidation } from "./model";
import * as crypto from "crypto";

export const userCreate: Handler<
  Context<Configuration>,
  Configuration,
  undefined,
  UserCreate,
  UserIdentifier
> = {
  namespace: "site",
  entity: "user",
  operation: "create",

  dataValidation: userCreateValidation,
  authorizationRequired: true,

  async handle(ctx, { data }) {
    const userDatabase: UserDatabase = {
      username: data.username,
      displayName: data.displayName,
      passwordHash: crypto.createHash("sha256").update(data.password).digest("hex"),
      email: data.email,
    };

    await ctx.database.db().collection("users")
      .insertOne(userDatabase);

    return { data: { username: data.username } };
  },
};
