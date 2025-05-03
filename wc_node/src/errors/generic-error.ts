import { CustomError } from './custom-error';

export class GenericError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, GenericError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}