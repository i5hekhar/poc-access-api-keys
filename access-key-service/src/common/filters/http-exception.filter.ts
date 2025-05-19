import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.error('EXCEPTION:', exception?.errorResponse ?? exception);
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Oops! Something went wrong. Please try again later.';
    if (exception?.errorResponse?.errmsg) {
      status = status;
      message = exception?.errorResponse?.errmsg;
    }

    const errorResponse = {
      statusCode: status,
      message: message,
    };

    response.status(status).json(errorResponse);
  }
}
