import { Module } from '@nestjs/common';
import { NflModule } from './nfl/nfl.module';
import { MotorsportsModule } from './motorsports/motorsports.module';
import { LiveTVModule } from './livetv/livetv.module';

@Module({
    imports: [
        NflModule,
        MotorsportsModule,
        LiveTVModule
    ],
    providers: [],
    controllers: [],
})
export class StreamingModule {}