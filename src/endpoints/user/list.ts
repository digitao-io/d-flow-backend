import { Configuration, Context, Handler } from "../../main";
import { User, UserIdentifier } from "./model";

export const userList: Handler<
  Context<Configuration>,
  Configuration,
  UserIdentifier,
  undefined,
  Array<User>
> = {
  namespace: "site",
  entity: "user",
  operation: "list",

  async handle(ctx) {
    const user = await ctx.database.db().collection<User>("users").find({}, { projection: { _id: 0 } }).toArray();
    return { data: user };
  },
};
