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

  async handle(ctx, input, { res }) {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      path: "/",
    });

    return { data: undefined };
  },
};
