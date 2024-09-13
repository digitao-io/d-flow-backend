import { patterns } from "../../app/pattern";

export interface UserData {
  password: string;
  displayName: string;
  email: string;
}

export const userDataValidation = {
  type: "object",
  additionalPropeties: false,
  required: [
    "displayName",
    "email",
    "password",
  ],
  properties: {
    password: { type: "string", pattern: patterns.anyString(40) },
    displayName: { type: "string", pattern: patterns.nonEmptyString(40) },
    email: { type: "string", pattern: patterns.isEmail() },
  },
};

export interface UserIdentifier {
  username: string;
}

export const userIdentifierValidation = {
  type: "object",
  additionalProperties: false,
  required: [
    "username",
  ],
  properties: {
    username: { type: "string", pattern: patterns.slug(40) },
  },
};

export interface User extends UserData, UserIdentifier {}

export const userValidation = {
  type: "object",
  additionalProperties: false,
  required: [
    ...userDataValidation.required,
    ...userIdentifierValidation.required,
  ],
  properties: {
    ...userDataValidation.properties,
    ...userIdentifierValidation.properties,
  },
};
