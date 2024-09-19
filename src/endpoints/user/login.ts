import { Configuration, Context, Handler, HandlerError } from "../../main";
import { UserLogin, userLoginValidation } from "./model";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

export const userLogin: Handler<
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

  async handle(ctx, { data }, { res }) {
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

    const issueTime = Math.floor(Date.now() / 1000);
    const expireTime = issueTime + ctx.configuration.jwt.expireIn;

    const jwtString = jwt.sign(
      {
        username,
        iat: issueTime,
        nbf: issueTime,
        exp: expireTime,
      },
      ctx.configuration.jwt.serverSecret,
      { algorithm: "HS256" },
    );

    res.cookie("jwt", jwtString, {
      maxAge: ctx.configuration.jwt.expireIn * 1000,
      httpOnly: true,
      path: "/",
    });

    return { data: undefined };
  },
};
