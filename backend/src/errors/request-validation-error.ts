import { CustomError } from "./custom-error";

export interface IValidationError {
  message: string;
  field: string;
}

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: IValidationError[]) {
    super("Invalid request parameters");
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return {
      status: this.statusCode,
      message: this.message,
      errors: this.errors
    };
  }
}