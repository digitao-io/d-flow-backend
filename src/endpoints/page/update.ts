import { Configuration, Context, Handler, HandlerError } from "../../main";
import { Page, PageIdentifier, pageIdentifierValidation, pageValidation } from "./model";

export const pageUpdate: Handler<
  Context<Configuration>,
  Configuration,
  PageIdentifier,
  Page,
  PageIdentifier
> = {
  namespace: "site",
  entity: "page",
  operation: "update",

  paramsValidation: pageIdentifierValidation,
  dataValidation: pageValidation,

  async handle(ctx, { params, data }) {
    const updateResult = await ctx.database.db().collection("pages").updateOne(
      { key: params.key },
      { $set: data },
    );

    if (updateResult.modifiedCount < 1) {
      throw new HandlerError("ENTITY_NOT_FOUND", `Page with key ${params.key} doesn't exist`);
    }

    return { data: { key: data.key } };
  },
};
