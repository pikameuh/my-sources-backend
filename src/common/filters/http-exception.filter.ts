import { Catch, HttpException, ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { Response } from 'express';
import { Color } from "../enums/colors.enum";
import { LogC } from "../utils/logc";

/**
 * Catch all HttpException coming from the application
 */
@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const error =
      typeof response === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as object);

    LogC.log(` + exceptionResponse  ${JSON.stringify(exceptionResponse)}`, Color.FgRed);
    LogC.log(` + status  ${JSON.stringify(status)}`, Color.FgRed);

    LogC.log(` + HttpExceptionFilter.catch(${status}, ${JSON.stringify(error)})`, Color.FgRed);
    
    response.status(status).json({
      ...error,
      timestamp: new Date().toISOString(),
    });
  }
}
