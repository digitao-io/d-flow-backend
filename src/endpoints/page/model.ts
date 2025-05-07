import { patterns } from "../../app/pattern";

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

export interface PageRequestData {
  title: string;
  description: string;
  urlPattern: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: any;
}

export const pageRequestDataValidation = {
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
  title: string;
  description: string;
  urlPattern: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: any;

  createdAt: Date;
  updatedAt: Date;
}

export interface PageResponseData {
  title: string;
  description: string;
  urlPattern: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: any;

  createdAt: string;
  updatedAt: string;
}

export interface PageResponse extends PageResponseData, PageIdentifier {}
export interface PageDatabase extends PageDatabaseData, PageIdentifier {}

export interface PageRequest extends PageRequestData, PageIdentifier {}
export const pageRequestValidation = {
  type: "object",
  additionalProperties: false,
  required: [
    ...pageRequestDataValidation.required,
    ...pageIdentifierValidation.required,
  ],
  properties: {
    ...pageRequestDataValidation.properties,
    ...pageIdentifierValidation.properties,
  },
};
