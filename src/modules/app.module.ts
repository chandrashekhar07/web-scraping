import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common';
import { PassengerModule } from './passenger/passenger.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionsFilter } from './common/flow/';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot(),
        PassengerModule,
        CommonModule
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionsFilter
        },
        CommonModule
    ]
})
export class ApplicationModule {}
