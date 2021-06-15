import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { MerolaganiController } from './merolagani.controller';
import { MerolaganiService } from './merolagani.service';

@Module({
    imports: [CommonModule],
    providers: [MerolaganiService],
    controllers: [MerolaganiController],
    exports: []
})
export class MerolaganiModule {}
