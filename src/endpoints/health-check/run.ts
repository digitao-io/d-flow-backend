import { Configuration, Context, Handler } from "../../main";

export const healthCheckRun: Handler<
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
