import { patterns } from "../../app/pattern";

export interface FileData {
  description: string;
}

export const fileDataValidation = {
  type: "object",
  additionalProperties: false,
  required: [
    "description",
  ],
  properties: {
    description: { type: "string", pattern: patterns.anyString(400) },
  },
};

export interface FileCreateData {
  mimeType: string;
  sizeInBytes: number;
}

export const fileCreateDataValidation = {
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

export interface FileDatabaseData {
  createdAt: Date;
}

export interface FileResponseData {
  createdAt: string;
}

export interface FileResponse extends FileData, FileResponseData, FileIdentifier {}

export interface FileDatabase extends FileData, FileIdentifier, FileDatabaseData, FileCreateData {}

export interface FileCreate extends FileData, FileCreateData, FileIdentifier {}

export const fileCreateValidation = {
  type: "object",
  additionalProperties: false,
  required: [
    ...fileDataValidation.required,
    ...fileCreateDataValidation.required,
    ...fileIdentifierValidation.required,
  ],
  properties: {
    ...fileDataValidation.properties,
    ...fileCreateDataValidation.properties,
    ...fileIdentifierValidation.properties,
  },
};

export interface FileUpdate extends FileData, FileIdentifier {}

export const fileUpdateValidation = {
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
