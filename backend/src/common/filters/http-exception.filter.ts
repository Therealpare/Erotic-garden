import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Normalizes every thrown error (HttpException or otherwise) into one JSON shape,
 * so API consumers never have to branch on error format. Spec §36/§47: consistent
 * error handling.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const isServerError = status >= HttpStatus.INTERNAL_SERVER_ERROR;

    // Unexpected errors (e.g. database failures) are logged in full but never echoed to clients.
    const message = isServerError
      ? 'Internal server error'
      : exceptionResponse &&
          typeof exceptionResponse === 'object' &&
          'message' in exceptionResponse
        ? (exceptionResponse as { message: string | string[] }).message
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';

    // Structured details a handler chose to expose (e.g. which items are out of stock).
    const details =
      !isServerError &&
      exceptionResponse &&
      typeof exceptionResponse === 'object'
        ? Object.fromEntries(
            Object.entries(exceptionResponse).filter(
              ([key]) => !['statusCode', 'message', 'error'].includes(key),
            ),
          )
        : {};

    if (isServerError) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json({
      ...details,
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      message,
    });
  }
}
