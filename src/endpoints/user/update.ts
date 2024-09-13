import { Configuration, Context, Handler } from "../../main";
import { UserData, UserIdentifier, userIdentifierValidation } from "./model";
import * as crypto from "crypto";

export const userUpdate: Handler<
  Context<Configuration>,
  Configuration,
  UserIdentifier,
  UserData,
  UserIdentifier
> = {
  namespace: "site",
  entity: "user",
  operation: "update",

  paramsValidation: userIdentifierValidation,

  async handle(ctx, { params, data }) {
    if (data.password) {
      const passwordHash = crypto.createHash("sha256").update(data.password).digest("hex");
      data.password = passwordHash;
    }
    else {
      throw new Error("Password is required");
    }

    await ctx.database.db().collection("users").updateOne(
      { username: params.username },
      { $set: data },
    );
    return { data: { username: params.username } };
  },
};
