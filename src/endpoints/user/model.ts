import { patterns } from "../../app/pattern";

export interface UserData {
  displayName: string;
  email: string;
}

export const userDataValidation = {
  type: "object",
  additionalPropeties: false,
  required: [
    "displayName",
    "email",
  ],
  properties: {
    displayName: { type: "string", pattern: patterns.nonEmptyString(40) },
    email: { type: "string", pattern: patterns.email() },
  },
};

export interface UserDatabaseData {
  passwordHash: string;
}

export interface UserCreateData {
  password: string;
}

export const userCreateDataValidation = {
  type: "object",
  additionalPropeties: false,
  required: [
    "password",
  ],
  properties: {
    password: { type: "string", pattern: patterns.nonEmptyString(40) },
  },
};

export interface UserUpdateData {
  password?: string;
}

export const userUpdateDataValidation = {
  type: "object",
  additionalPropeties: false,
  required: [],
  properties: {
    password: { type: "string", pattern: patterns.nonEmptyString(40), nullable: true },
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

export interface UserDatabase extends UserDatabaseData, UserData, UserIdentifier {}

export interface UserCreate extends UserCreateData, UserData, UserIdentifier {}

export const userCreateValidation = {
  type: "object",
  additionalProperties: false,
  required: [
    ...userCreateDataValidation.required,
    ...userDataValidation.required,
    ...userIdentifierValidation.required,
  ],
  properties: {
    ...userCreateDataValidation.properties,
    ...userDataValidation.properties,
    ...userIdentifierValidation.properties,
  },
};

export interface UserUpdate extends UserUpdateData, UserData, UserIdentifier {}

export const userUpdateValidation = {
  type: "object",
  additionalProperties: false,
  required: [
    ...userUpdateDataValidation.required,
    ...userDataValidation.required,
    ...userIdentifierValidation.required,
  ],
  properties: {
    ...userUpdateDataValidation.properties,
    ...userDataValidation.properties,
    ...userIdentifierValidation.properties,
  },
};
