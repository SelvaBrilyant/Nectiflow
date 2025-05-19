import { CustomError } from "./custom-error";

export class UnAuthenticatedError extends CustomError {
  statusCode = 401;

  constructor(public message: string = "UnAuthenticated") {
    super(message);
    Object.setPrototypeOf(this, UnAuthenticatedError.prototype);
  }

  serializeErrors() {
    return {
      status: this.statusCode,
      message: this.message
    };
  }
}