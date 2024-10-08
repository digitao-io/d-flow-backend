import { Configuration, Context, WrappedHandler } from "../../main";
import { PageCreateAndUpdate, PageDatabase, PageIdentifier, pageCreateAndUpdateValidation } from "./model";

export const pageCreate: WrappedHandler<
  Context<Configuration>,
  Configuration,
  undefined,
  PageCreateAndUpdate,
  PageIdentifier
> = {
  namespace: "site",
  entity: "page",
  operation: "create",

  authorizationRequired: true,
  dataValidation: pageCreateAndUpdateValidation,

  async handle(ctx, { data }) {
    const now = new Date();
    const pageDatabase: PageDatabase = {
      key: data.key,
      title: data.title,
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
