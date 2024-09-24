import { Configuration } from "../../app/configuration";
import { Context } from "../../app/context";
import { WrappedHandler } from "../../app/handler";

export const userAuthorize: WrappedHandler<
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
