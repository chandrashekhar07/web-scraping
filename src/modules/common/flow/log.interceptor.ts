import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoggerService } from '../provider';

@Injectable()
export class LogInterceptor implements NestInterceptor {
    public constructor(private readonly logger: LoggerService) {}

    public intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<Response> {
        const startTime = new Date().getTime();
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const statusCode = ctx.getResponse().statusCode;

        return next.handle().pipe(
            map((data) => {
                this.logger.info(
                    `${this.getTimeDelta(startTime)}ms ${
                        request.ip
                    } ${statusCode} ${request.method} ${this.getUrl(request)}`
                );

                const response: any = {
                    data,
                    httpCode: statusCode,
                    path: request.url,
                    timestamp: new Date().toISOString
                };
                return response;
            }),
            catchError((err) => {
                // Log fomat inspired by the Squid docs
                // See https://docs.trafficserver.apache.org/en/6.1.x/admin-guide/monitoring/logging/log-formats.en.html
                this.logger.error(
                    `${this.getTimeDelta(startTime)}ms ${request.ip} ${
                        err.status
                    } ${request.method} ${this.getUrl(request)}`,
                    err
                );
                return throwError(err);
            })
        );
    }

    private getTimeDelta(startTime: number): number {
        return new Date().getTime() - startTime;
    }

    private getUrl(request: Request): string {
        return `${request.protocol}://${request.get('host')}${
            request.originalUrl
        }`;
    }
}

export interface ResponsePayload {
    data: any;
    httpCode: number;
    path: string;
    timestamp: string;
}
