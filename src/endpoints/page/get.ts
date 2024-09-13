import { Configuration, Context, Handler, HandlerError } from "../../main";
import { PageResponse, PageIdentifier, pageIdentifierValidation, PageDatabase } from "./model";

export const pageGet: Handler<
  Context<Configuration>,
  Configuration,
  PageIdentifier,
  undefined,
  PageResponse
> = {
  namespace: "site",
  entity: "page",
  operation: "get",

  paramsValidation: pageIdentifierValidation,

  async handle(ctx, { params }) {
    const page = await ctx.database.db().collection("pages")
      .findOne<PageDatabase>(
        { key: params.key },
        { projection: { _id: 0 } },
      );

    if (page === null) {
      throw new HandlerError("ENTITY_NOT_FOUND", `Page with key ${params.key} doesn't exist`);
    }

    return {
      data: {
        key: page.key,
        title: page.title,
        description: page.description,
        urlPattern: page.urlPattern,
        details: page.details,
        createdAt: page.createdAt.toISOString(),
        updatedAt: page.updatedAt.toISOString(),
      },
    };
  },
};
