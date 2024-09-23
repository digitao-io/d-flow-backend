import { Configuration, Context, Handler } from "../../main";
import { UserResponse } from "./model";

export const userList: Handler<
  Context<Configuration>,
  Configuration,
  undefined,
  undefined,
  Array<UserResponse>
> = {
  namespace: "site",
  entity: "user",
  operation: "list-all",

  authorizationRequired: true,

  async handle(ctx) {
    const users = await ctx.database.db().collection("users")
      .find<UserResponse>({}, { projection: { _id: 0, passwordHash: 0 } })
      .sort({ username: 1 })
      .toArray();
    const total = await ctx.database.db().collection("users")
      .countDocuments({});
    return {
      data: users,
      total,
    };
  },
};
