export abstract class CustomError extends Error {
    abstract statusCode: number;
    isOperational: boolean;
  
    constructor(message: string) {
      super(message);
      this.isOperational = true;
      Object.setPrototypeOf(this, CustomError.prototype);
    }
  
    abstract serializeErrors(): { message: string; fields?: string }[];
  }
  