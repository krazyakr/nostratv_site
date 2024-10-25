import { Module } from '@nestjs/common';
import { MotorsportsController } from './motorsports.controller';
import { MotorsportsService } from './motorsports.service';

@Module({
    imports: [],
    controllers: [MotorsportsController],
    providers: [MotorsportsService],
})
export class MotorsportsModule {}