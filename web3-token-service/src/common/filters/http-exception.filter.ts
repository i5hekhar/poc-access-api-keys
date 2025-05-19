import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.error('EXCEPTION:', exception?.response ?? exception);
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Oops! Something went wrong. Please try again later.';
    if ((exception?.errorResponse?.errmsg || exception?.response?.message) ?? exception?.response) {
      status = status;
      message = exception?.errorResponse?.errmsg ?? exception?.response?.message ?? exception?.response;
    }

    const errorResponse = {
      statusCode: status,
      message: message,
    };

    response.status(status).json(errorResponse);
  }
}
