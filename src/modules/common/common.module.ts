import { Module } from '@nestjs/common';
import { LogInterceptor } from './flow';
import { configProvider, LoggerService } from './provider';
import { WelcomeController } from './welcome.controller';

@Module({
    providers: [configProvider, LoggerService, LogInterceptor],
    exports: [configProvider, LoggerService, LogInterceptor],
    controllers: [WelcomeController]
})
export class CommonModule {}
