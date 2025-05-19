import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(public resource?: string) {
    super(`${resource ?? "Resource"} Not Found`);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return {
      status: this.statusCode,
      message: `${this.resource ?? "Resource"} Not Found`
    };
  }
}