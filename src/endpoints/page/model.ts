import { patterns } from "../../app/pattern";

export interface PageData {
  title: string;
  description: string;
  urlPattern: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: any;
}

export const pageDataValidation = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "description",
    "urlPattern",
    "details",
  ],
  properties: {
    title: { type: "string", pattern: patterns.nonEmptyString(120) },
    description: { type: "string", pattern: patterns.anyString(240) },
    urlPattern: { type: "string", pattern: patterns.urlPath() },
    details: { type: "object" },
  },
};

export interface PageDatabaseData {
  createdAt: Date;
  updatedAt: Date;
}

export interface PageResponseData {
  createdAt: string;
  updatedAt: string;
}

export interface PageIdentifier {
  key: string;
}

export const pageIdentifierValidation = {
  type: "object",
  additionalProperties: false,
  required: [
    "key",
  ],
  properties: {
    key: { type: "string", pattern: patterns.slug(120) },
  },
};

export interface PageResponse extends PageData, PageResponseData, PageIdentifier {}

export interface PageDatabase extends PageData, PageDatabaseData, PageIdentifier {}

export interface PageCreateAndUpdate extends PageData, PageIdentifier {}

export const pageCreateAndUpdateValidation = {
  type: "object",
  additionalProperties: false,
  required: [
    ...pageDataValidation.required,
    ...pageIdentifierValidation.required,
  ],
  properties: {
    ...pageDataValidation.properties,
    ...pageIdentifierValidation.properties,
  },
};
