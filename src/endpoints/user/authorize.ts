import { Configuration } from "../../app/configuration";
import { Context } from "../../app/context";
import { Handler } from "../../app/handler";

export const userAuthorize: Handler<
  Context<Configuration>,
  Configuration,
  undefined,
  undefined,
  undefined
> = {
  namespace: "site",
  entity: "user",
  operation: "authorize",

  authorizationRequired: true,

  async handle() {
    return { data: undefined };
  },
};
