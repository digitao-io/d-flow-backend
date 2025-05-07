import { Configuration, Context, WrappedHandler } from "../../main";
import { PageRequest, PageDatabase, PageIdentifier, pageRequestValidation } from "./model";

export const pageCreate: WrappedHandler<
  Context<Configuration>,
  Configuration,
  undefined,
  PageRequest,
  PageIdentifier
> = {
  namespace: "site",
  entity: "page",
  operation: "create",

  authorizationRequired: true,
  dataValidation: pageRequestValidation,

  async handle(ctx, { data }) {
    const now = new Date();
    const pageDatabase: PageDatabase = {
      key: data.key,
      name: data.name,
      description: data.description,
      urlPattern: data.urlPattern,
      details: data.details,
      createdAt: now,
      updatedAt: now,
    };

    await ctx.database.db().collection("pages")
      .insertOne(pageDatabase);

    return { data: { key: data.key } };
  },
};
