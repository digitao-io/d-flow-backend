import { Configuration, Context, WrappedHandler } from "../../main";

export const healthCheckRun: WrappedHandler<
  Context<Configuration>,
  Configuration,
  undefined,
  undefined,
  undefined
> = {
  namespace: "site",
  entity: "health-check",
  operation: "run",

  handle: async () => {
    return { data: undefined };
  },
};
