import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Post,
    HttpCode
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoggerService } from '../../common/provider';
import { PassengerPipe } from '../flow';
import { PassengerData, PassengerInput } from '../model';
import { PassengerService } from '../service';

@Controller('passengers')
@ApiTags('passenger')
@ApiBearerAuth()
export class PassengerController {
    public constructor(
        private readonly logger: LoggerService,
        private readonly passengerService: PassengerService
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({ status: HttpStatus.OK, isArray: false, type: PassengerData })
    public async find(): Promise<PassengerData[]> {
        this.logger.info('Getting data for passengers');
        const passengers = await this.passengerService.find();
        return passengers.map((passenger) => passenger.buildData());
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiResponse({ status: HttpStatus.CREATED, type: PassengerData })
    public async create(
        @Body(new PassengerPipe()) input: PassengerInput
    ): Promise<PassengerData> {
        const passenger = await this.passengerService.create(input);
        this.logger.info(`Created new passenger with ID ${passenger.id}`);

        return passenger.buildData();
    }
}
