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
  name: string;
  description: string;
  urlPattern: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: any;
}

export const pageRequestDataValidation = {
  type: "object",
  additionalProperties: false,
  required: [
    "name",
    "description",
    "urlPattern",
    "details",
  ],
  properties: {
    name: { type: "string", pattern: patterns.nonEmptyString(120) },
    description: { type: "string", pattern: patterns.anyString(500) },
    urlPattern: { type: "string", pattern: patterns.urlPath() },
    details: { type: "object" },
  },
};

export interface PageDatabaseData {
  name: string;
  description: string;
  urlPattern: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: any;

  createdAt: Date;
  updatedAt: Date;
}

export interface PageResponseData {
  name: string;
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
