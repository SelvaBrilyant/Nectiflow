import { CustomError } from "./custom-error";

export class UnprocessableError extends CustomError {
  statusCode = 422;

  constructor(public resource?: string, public action = "create", public mess?: string) {
    super(`Can't ${action} ${resource} Resource`);
    Object.setPrototypeOf(this, UnprocessableError.prototype);
  }

  serializeErrors() {
    return {
      status: this.statusCode,
      message: this.mess ?? `Can't ${this.action} ${this.resource} Resource`
    };
  }
}
