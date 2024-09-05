import { RequestHandler } from "express";
import { Ajv, DefinedError } from "ajv";
import { Configuration } from "./configuration";
import { Context } from "./context";

export interface HandlerInput<
  PARAMS,
  DATA,
> {
  params: PARAMS;
  data: DATA;
}

export interface HandlerResponse<RESPONSE> {
  data: RESPONSE;
  total?: number;
}

export type HandlerErrorType =
  | "AUTH_FAILED"
  | "INVALID_PARAMS"
  | "INVALID_DATA"
  | "ENTITY_NOT_FOUND"
  | "INTERNAL_ERROR";

export class HandlerError extends Error {
  public status: number;
  public error: HandlerErrorType;

  public constructor(error: HandlerErrorType, message: string) {
    super(message);

    this.status = {
      AUTH_FAILED: 401,
      INVALID_PARAMS: 400,
      INVALID_DATA: 400,
      ENTITY_NOT_FOUND: 404,
      INTERNAL_ERROR: 500,
    }[error];
    this.error = error;
  }
}

export type HandlerOperation =
  | "create"
  | "list"
  | "get"
  | "update"
  | "delete"
  | "run";

export interface Handler<
  CTX extends Context<CONFIG>,
  CONFIG extends Configuration,
  PARAMS,
  DATA,
  RESPONSE,
> {
  namespace: string;
  entity: string;
  operation: HandlerOperation;

  permissionRequired?: true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paramsValidation?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataValidation?: any;

  handle: (ctx: CTX, input: HandlerInput<PARAMS, DATA>) => Promise<HandlerResponse<RESPONSE>>;
}

export function wrapHandler<
  CTX extends Context<CONFIG>,
  CONFIG extends Configuration,
  PARAMS,
  DATA,
  RESPONSE,
>(
  ctx: CTX,
  handler: Handler<CTX, CONFIG, PARAMS, DATA, RESPONSE>,
): RequestHandler {
  const ajv = new Ajv();
  const validateParams = handler.paramsValidation
    ? ajv.compile(handler.paramsValidation)
    : null;
  const validateData = handler.dataValidation
    ? ajv.compile(handler.dataValidation)
    : null;

  return async (req, res) => {
    if (validateParams && !validateParams(req.body?.params)) {
      const errors = validateParams.errors! as DefinedError[];

      res.status(400);
      res.json({
        status: "FAILED",
        error: "INVALID_PARAMS",
        message: `${errors[0].instancePath || "/"} ${errors[0].message}`,
      });

      return;
    }

    if (validateData && !validateData(req.body?.data)) {
      const errors = validateData.errors! as DefinedError[];

      res.status(400);
      res.json({
        status: "FAILED",
        error: "INVALID_DATA",
        message: `${errors[0].instancePath || "/"} ${errors[0].message}`,
      });

      return;
    }

    try {
      const response = await handler.handle(ctx, {
        params: req.body?.params,
        data: req.body?.data,
      });

      res.status(200);
      res.json({
        status: "OK",
        data: response.data,
        total: response.total,
      });
    }
    catch (err) {
      if (err instanceof HandlerError) {
        res.status(err.status);
        res.json({
          status: "FAILED",
          error: err.error,
          message: err.message,
        });
      }
      else {
        res.status(500);
        res.json({
          status: "FAILED",
          error: "INTERNAL_ERROR",
          message: err.message,
        });

        console.log(err);
      }
    }
  };
}
