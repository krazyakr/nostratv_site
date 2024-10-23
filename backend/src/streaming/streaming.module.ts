import { Module } from '@nestjs/common';
import { NflModule } from './nfl/nfl.module';
import { MotorsportsModule } from './motorsports/motorsports.module';

@Module({
    imports: [
        NflModule,
        MotorsportsModule
    ],
    providers: [],
    controllers: [],
})
export class StreamingModule {}