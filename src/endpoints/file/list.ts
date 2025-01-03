import { Configuration, Context, WrappedHandler } from "../../main";
import { FileDatabase, FileListParams, fileListParamsValidation, FileResponse } from "./model";

export const fileList: WrappedHandler<
  Context<Configuration>,
  Configuration,
  FileListParams,
  undefined,
  Array<FileResponse>
> = {
  namespace: "site",
  entity: "file",
  operation: "list",

  authorizationRequired: true,

  paramsValidation: fileListParamsValidation,

  async handle(ctx, { params }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filters: Record<string, any> = {};

    if (params.key) {
      filters["key"] = { "$regex": params.key?.replace(/[#-.]|[[-^]|[?|{}]/g, "\\$&"), "$options": "i" };
    }

    if (params.mimeType) {
      filters["mimeType"] = params.mimeType;
    }

    if (params.createdAfter) {
      if (!filters["createdAt"]) {
        filters["createdAt"] = {};
      }

      filters["createdAt"]["$gte"] = new Date(params.createdAfter);
    }

    if (params.createdBefore) {
      if (!filters["createdAt"]) {
        filters["createdAt"] = {};
      }

      filters["createdAt"]["$lt"] = new Date(params.createdBefore);
    }

    const files = await ctx.database.db().collection("files")
      .find<FileDatabase>(filters, { projection: { _id: 0 } })
      .sort({ [params.sortBy]: params.sortOrder === "ASC" ? 1 : -1 })
      .skip(params.itemsPerPage * (params.page - 1))
      .limit(params.itemsPerPage)
      .toArray();
    const total = await ctx.database.db().collection("files")
      .countDocuments(filters);

    return {
      data: files.map((file) => ({
        key: file.key,
        description: file.description,
        mimeType: file.mimeType,
        sizeInBytes: file.sizeInBytes,
        createdAt: file.createdAt.toISOString(),
      })),
      total,
    };
  },
};
