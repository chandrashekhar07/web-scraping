import { Param } from "@nestjs/common";
import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { HttpCode } from "@nestjs/common/decorators/http/http-code.decorator";
import { Get } from "@nestjs/common/decorators/http/request-mapping.decorator";
import { HttpStatus } from "@nestjs/common/enums/http-status.enum";
import { ApiResponse } from "@nestjs/swagger/dist/decorators/api-response.decorator";
import { ApiTags } from "@nestjs/swagger/dist/decorators/api-use-tags.decorator";
import { LoggerService } from "../common/provider";
import {  MerolaganiService } from "./merolagani.service";


@Controller('merolagani')
@ApiTags('merolagani')
export class MerolaganiController {
    public constructor(
        private readonly logger: LoggerService,
        private readonly merolaganiService: MerolaganiService
    ) {}

    @Get(':symbol')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK})
    find(@Param('symbol') symbol:string) {
        this.logger.info(`getting details of ${symbol}`)
        return this.merolaganiService.find(symbol);
    }

}
