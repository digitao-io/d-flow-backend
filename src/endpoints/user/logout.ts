import { Configuration, Context, Handler } from "../../main";

export const userLogout: Handler<
  Context<Configuration>,
  Configuration,
  undefined,
  undefined,
  undefined
> = {
  namespace: "site",
  entity: "user",
  operation: "logout",

  async handle(ctx, _input, { setCookie }) {
    setCookie("jwt", "", {
      maxAge: 0,
      domain: ctx.configuration.domain,
      httpOnly: true,
      path: "/",
    });

    return { data: undefined };
  },
};
