import { patterns } from "../../app/pattern";

export interface FileIdentifier {
  key: string;
}

export const fileIdentifierValidation = {
  type: "object",
  additionalProperties: false,
  required: [
    "key",
  ],
  properties: {
    key: { type: "string", pattern: patterns.filename() },
  },
};

export interface FileRequestData {
  description: string;
}

export const fileRequestDataValidation = {
  type: "object",
  additionalProperties: false,
  required: [
    "description",
  ],
  properties: {
    description: { type: "string", pattern: patterns.anyString(400) },
  },
};

export interface FileCreateExtraData {
  mimeType: string;
  sizeInBytes: number;
}

export const fileCreateExtraDataValidation = {
  type: "object",
  additionalProperties: false,
  required: [
    "mimeType",
    "sizeInBytes",
  ],
  properties: {
    mimeType: { type: "string", pattern: patterns.mimetype() },
    sizeInBytes: { type: "integer", minimum: 1 },
  },
};

export interface FileDatabaseData {
  createdAt: Date;
  mimeType: string;
  sizeInBytes: number;
  description: string;
}

export interface FileResponseData {
  createdAt: string;
  mimeType: string;
  sizeInBytes: number;
  description: string;
}

export interface FileResponse extends FileIdentifier, FileResponseData {}

export interface FileDatabase extends FileIdentifier, FileDatabaseData {}

export interface FileCreate extends FileIdentifier, FileRequestData, FileCreateExtraData {}

export const fileCreateValidation = {
  type: "object",
  additionalProperties: false,
  required: [
    ...fileIdentifierValidation.required,
    ...fileRequestDataValidation.required,
    ...fileCreateExtraDataValidation.required,
  ],
  properties: {
    ...fileIdentifierValidation.properties,
    ...fileRequestDataValidation.properties,
    ...fileCreateExtraDataValidation.properties,
  },
};

export interface FileUpdate extends FileIdentifier, FileRequestData {}

export const fileUpdateValidation = {
  type: "object",
  additionalProperties: false,
  required: [
    ...fileIdentifierValidation.required,
    ...fileRequestDataValidation.required,
  ],
  properties: {
    ...fileIdentifierValidation.properties,
    ...fileRequestDataValidation.properties,
  },
};

export interface FileListParams {
  key?: string;
  mimeType?: string;
  createdAfter?: string;
  createdBefore?: string;

  sortBy: string;
  sortOrder: "ASC" | "DESC";
  itemsPerPage: number;
  page: number;
}

export const fileListParamsValidation = {
  type: "object",
  additionalProperties: false,
  required: [
    "sortBy",
    "sortOrder",
    "itemsPerPage",
  ],
  properties: {
    key: { type: "string", pattern: patterns.anyString(40) },
    mimeType: { type: "string", pattern: patterns.mimetype() },
    createdAfter: { type: "string", pattern: patterns.isoDateTime() },
    createdBefore: { type: "string", pattern: patterns.isoDateTime() },
    sortBy: { type: "string", enum: ["key", "createdAt", "sizeInBytes"] },
    sortOrder: { type: "string", enum: ["ASC", "DESC"] },
    itemsPerPage: { type: "integer", minimum: 1 },
    page: { type: "integer", minimum: 1 },
  },
};
