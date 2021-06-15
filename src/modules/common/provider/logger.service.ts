import * as winston from 'winston';

export class LoggerService {
    private readonly instance: winston.Logger;

    public constructor() {
        const format = this.isProductionEnv()
            ? winston.format.combine(
                  winston.format.timestamp(),
                  winston.format.json(),
                  winston.format.errors({ stack: true })
              )
            : winston.format.combine(
                  winston.format.colorize(),
                  winston.format.simple(),
                  winston.format.errors({ stack: true })
              );

        this.instance = winston.createLogger({
            level: 'info',
            silent: this.isTestEnv(),
            format,
            transports: [
                new winston.transports.Console({
                    stderrLevels: ['error']
                })
            ]
        });
    }

    public info(message: string): void {
        this.instance.info(message);
    }

    public error(message: string, error?: Error): void {
        this.instance.error(message, error);
    }

    private isTestEnv(): boolean {
        const ENV = process.env.NODE_ENV || '';
        return false || ENV.trim() === 'dev';
    }

    private isProductionEnv(): boolean {
        const ENV = process.env.NODE_ENV || '';
        return ENV.trim() === 'production' || ENV.trim() === 'staging';
    }
}
