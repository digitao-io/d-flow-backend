import { Configuration, Context, Handler } from "../../main";
import { User, UserIdentifier, userValidation } from "./model";
import * as crypto from "crypto";

export const userCreate: Handler<
  Context<Configuration>,
  Configuration,
  undefined,
  User,
  UserIdentifier
> = {
  namespace: "site",
  entity: "user",
  operation: "create",

  dataValidation: userValidation,

  async handle(ctx, { data }) {
    if (data.password) {
      const passwordHash = crypto.createHash("sha256").update(data.password).digest("hex");
      data.password = passwordHash;
    }
    await ctx.database.db().collection("users").insertOne(data);
    return { data: { username: data.username } };
  },
};
