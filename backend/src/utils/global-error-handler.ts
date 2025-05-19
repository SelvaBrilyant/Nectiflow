import type { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors/custom-error';
import { RequestValidationError } from '../errors/request-validation-error';
import { BadRequestError } from '../errors/bad-request-error';
import { NotFoundError } from '../errors/not-found-error';
import { UnAuthenticatedError } from '../errors/unauthenticated-error';
import { NotAuthorizedError } from '../errors/forbidden-error';
import { UnprocessableError } from '../errors/unprocessable-error';
import { GenericError } from '../errors/generic-error';

/**
 * Handle development environment errors.
 *
 * @param {Object} res - Express response object.
 * @param {Object} error - CustomError object.
 */
const devErrors = (res: Response, error: CustomError): void => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error,
  });
};

/**
 * Handle production environment errors.
 *
 * @param {Object} res - Express response object.
 * @param {Object} error - CustomError object.
 */
const productionError = (res: Response, error: CustomError): void => {
  console.log('error',error.message);
  if (error instanceof RequestValidationError && error.errors.length > 0) {
    res.status(400).json({
      status: 'error',
      message: 'Validation errors occurred',
      errors: error.errors,
    });
   } else if (error.message) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
   } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};

/**
 * Handle duplicate key error and convert it into a CustomError.
 *
 * @param {Object} err - MongoDB duplicate key error.
 * @returns {CustomError} - CustomError object with a specific error message.
 */
const duplicateKeyErrorHandler = (err: any): CustomError => {
  let msg: string;
  if (err.keyValue.username) {
    msg = `There is already a product with name: ${err.keyValue.username} exists.`;
  } else if (err.keyValue.email) {
    msg = `There is already a user with email ${err.keyValue.email} exists.`;
  } else if (
    Object.prototype.hasOwnProperty.call(err.keyValue, 'phoneNumber.Number')
  ) {
    msg = `There is already a user with Phone number ${err.keyValue['phoneNumber.Number']} exists.`;
  } else {
    msg = 'Duplicate key error, but specific field is missing.';
  }
  return new GenericError(msg);
};

/**
 * Handle validation errors and convert them into a CustomError.
 *
 * @param {Object} err - MongoDB validation error.
 * @returns {CustomError} - CustomError object with a specific error message.
 */
const validationErrorHandler = (err: any): CustomError => {
  const errors = Object.values(err.error).map((val: any) => ({
    message: val.msg,
    value: val.value,
  }));
  const errorMessages = errors
    .map((error: any) => `${error.message} (${error.value})`)
    .join(', ');
  const msg = `Invalid input data: ${errorMessages}`;
  return new GenericError(msg);
};

/**
 * Express error handler middleware.
 *
 * @param {Object} error - Error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const globalErrorHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Set default status code and status if not provided
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    // Handle errors in development environment
    devErrors(res, error);
  } else if (process.env.NODE_ENV === 'production') {
    // Handle errors in production environment

    // If any duplicate key is found, handle it here
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);

    // If it's a validation error, handle it here
    if (error.message === 'Validation failed')
      error = validationErrorHandler(error);

    // Handle specific error types
    if (error instanceof BadRequestError) {
      res.status(error.statusCode).json({ message: error.message });
      return; // Exit after sending the response
    } else if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ message: error.message });
      return; // Exit after sending the response
    } else if (error instanceof UnAuthenticatedError) {
      res.status(error.statusCode).json({ message: error.message });
      return; // Exit after sending the response
    } else if (error instanceof NotAuthorizedError) {
      res.status(error.statusCode).json({ message: error.message });
      return; // Exit after sending the response
    } else if (error instanceof UnprocessableError) {
      res.status(error.statusCode).json({ message: error.message });
      return; // Exit after sending the response
    }

    // Handle other types of errors here
    if (error.name === 'UnauthorizedError') {
      error = new GenericError('Unauthorized access');
    } else if (error.name === 'ForbiddenError') {
      error = new GenericError('Forbidden access');
    }

    productionError(res, error);
  }
};

export default globalErrorHandler;