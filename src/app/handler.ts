import { Request, Response, RequestHandler } from "express";
import { Ajv, DefinedError } from "ajv";
import { Configuration } from "./configuration";
import { Context } from "./context";
import { verifyJwt } from "./jwt";

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

export interface Handler<
  CTX extends Context<CONFIG>,
  CONFIG extends Configuration,
  PARAMS,
  DATA,
  RESPONSE,
> {
  namespace: string;
  entity: string;
  operation: string;

  authorizationRequired?: true;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paramsValidation?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataValidation?: any;

  handle: (ctx: CTX, input: HandlerInput<PARAMS, DATA>, expressCtx: ExpressCtx) => Promise<HandlerResponse<RESPONSE>>;
}

export interface ExpressCtx {
  req: Request;
  res: Response;
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
    try {
      if (handler.authorizationRequired) {
        const jwtCookie = (req.header("Cookie") ?? "").split(";").find((cookie) => cookie.split("=")[0].trim() === "jwt");

        if (!jwtCookie) {
          throw new HandlerError("AUTH_FAILED", "Authorization failed");
        }
        const token = jwtCookie.split("=")[1].trim();

        if (!verifyJwt(token, ctx.configuration.jwt.serverSecret)) {
          throw new HandlerError("AUTH_FAILED", "Authorization failed");
        }
      }

      if (validateParams && !validateParams(req.body?.params)) {
        const errors = validateParams.errors! as DefinedError[];

        throw new HandlerError("INVALID_PARAMS", `${errors[0].instancePath || "/"} ${errors[0].message}`);
      }

      if (validateData && !validateData(req.body?.data)) {
        const errors = validateData.errors! as DefinedError[];

        throw new HandlerError("INVALID_DATA", `${errors[0].instancePath || "/"} ${errors[0].message}`);
      }

      const response = await handler.handle(
        ctx,
        {
          params: req.body?.params,
          data: req.body?.data,
        },
        { req, res },
      );

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
