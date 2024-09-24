import * as crypto from "crypto";
import { signJwt } from "../../app/jwt";
import { Configuration, Context, WrappedHandler, HandlerError } from "../../main";
import { UserLogin, userLoginValidation } from "./model";

export const userLogin: WrappedHandler<
  Context<Configuration>,
  Configuration,
  undefined,
  UserLogin,
  undefined
> = {
  namespace: "site",
  entity: "user",
  operation: "login",

  dataValidation: userLoginValidation,

  async handle(ctx, { data }, { setCookie }) {
    const username = data.username;
    const passwordHash = crypto.createHash("sha256").update(data.password).digest("hex");

    let loginSuccessful: boolean = ctx.configuration.users
      .some((user) => user.username === username && user.passwordHash === passwordHash);

    if (!loginSuccessful) {
      const numberOfMatchingUser = await ctx.database.db().collection("users")
        .countDocuments({ username, passwordHash });

      if (numberOfMatchingUser === 1) {
        loginSuccessful = true;
      }
    }

    if (!loginSuccessful) {
      throw new HandlerError("AUTH_FAILED", "Login failed");
    }

    const token = signJwt(
      username,
      ctx.configuration.jwt.expireIn,
      ctx.configuration.jwt.serverSecret,
    );

    setCookie("jwt", token, {
      maxAge: ctx.configuration.jwt.expireIn * 1000,
      domain: ctx.configuration.domain,
      httpOnly: true,
      path: "/",
    });

    return { data: undefined };
  },
};
