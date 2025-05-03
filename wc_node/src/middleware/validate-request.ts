import { NextFunction, Request, Response } from "express";
import Joi, { AnySchema } from "joi";
import { RequestValidationError } from "../errors/request-validation-error";

const validate = (type: "query" | "body" | "params") => {
  return (schema: AnySchema | Record<string, AnySchema>) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const payload = req[type];
      let finalSchema: AnySchema;

      if (Joi.isSchema(schema)) { 
        finalSchema = schema;
      } else {
        finalSchema = Joi.object(schema);
      }

      const { error } = finalSchema.validate(payload, { abortEarly: false });

      if (error) {
        const prefixes = {
          body: "",
          query: "The query parameter",
          params: "The path parameter",
        };
        // console.log(error);
        const errors = error.details.map((detail) => ({
          message: `${prefixes[type]} ${detail.message}`,
          field: (detail.context?.label || detail.context?.key)!,
        }));

        throw new RequestValidationError(errors);
      }

      next();
    };
  };
};

export const body = validate("body");
export const query = validate("query");
export const params = validate("params");