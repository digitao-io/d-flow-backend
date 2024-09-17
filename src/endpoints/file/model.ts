import { patterns } from "../../app/pattern";

export interface FileData {
  description: string;
  mimeType: string;
  sizeInBytes: number;
}

export const fileDataValidation = {
  type: "object",
  additionalProperties: false,
  required: [
    "description",
    "mimeType",
    "sizeInBytes",
  ],
  properties: {
    description: { type: "string", pattern: patterns.anyString(400) },
    mimeType: { type: "string", pattern: patterns.mimetype() },
    sizeInBytes: { type: "integer", minimum: 1 },
  },
};

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
    key: { type: "string", pattern: patterns.slug(40) },
  },
};

export interface FileDatabaseData {
  createdAt: Date;
}

export interface FileResponseData {
  createdAt: string;
}

export interface FileResponse extends FileData, FileResponseData, FileIdentifier {}

export interface FileDatabase extends FileData, FileIdentifier, FileDatabaseData {}

export interface FileCreateAndUpdate extends FileData, FileIdentifier {}

export const fileCreateAndUpdateValidation = {
  type: "object",
  additionalProperties: false,
  required: [
    ...fileDataValidation.required,
    ...fileIdentifierValidation.required,
  ],
  properties: {
    ...fileDataValidation.properties,
    ...fileIdentifierValidation.properties,
  },
};
