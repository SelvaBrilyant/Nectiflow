import { CustomError } from "./custom-error";

export class UnAuthenticatedError extends CustomError {
  statusCode = 401;

  constructor(public mess?: string) {
    super("UnAuthenticated");
    Object.setPrototypeOf(this, UnAuthenticatedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.mess || "UnAuthenticated", status: this.statusCode }];
  }
}