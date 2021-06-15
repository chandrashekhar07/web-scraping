import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus
} from '@nestjs/common';
import { LoggerService } from '../provider';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
    public constructor(private readonly logger: LoggerService) {}

    public catch(exception: any, host: ArgumentsHost): void {
        const startTime = new Date().getTime();
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        this.logger.error(
            `${this.getTimeDelta(startTime)}ms ${request.ip} ${
                exception.status
            } ${request.method} ${this.getUrl(request)}`,
            exception
        );

        if (!exception.hasOwnProperty('response')) {
            this.raiseException(request, response, exception, null);
            return;
        }

        if (exception['response'].hasOwnProperty('detail')) {
            const error = exception['response']['detail'];
            this.raiseException(request, response, exception, error);
            return;
        }

        if (exception['response'].hasOwnProperty('error')) {
            const error = exception['response']['error'];
            this.raiseException(request, response, exception, error);
            return;
        }

        this.raiseException(request, response, exception);
    }

    public raiseException(
        request: Request,
        response,
        exception,
        error = null
    ): void {
        const message = 'Internal server error';
        const msg =
            exception instanceof HttpException ? exception.message : message;
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.BAD_REQUEST;
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: msg,
            error: error !== null ? error : message
        });
    }

    private getTimeDelta(startTime: number): number {
        return new Date().getTime() - startTime;
    }

    private getUrl(request): string {
        return `${request.protocol}://${request.hostname}${request.originalUrl}`;
    }
}
