import { CustomError } from './custom-error';

export class GenericError extends CustomError {
  statusCode = 500;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, GenericError.prototype);
  }

  serializeErrors() {
    return {
      status: this.statusCode,
      message: this.message
    };
  }
}