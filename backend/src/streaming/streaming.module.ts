import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NflModule } from './nfl/nfl.module';
import { MotorsportsModule } from './motorsports/motorsports.module';
import { LiveTVModule } from './livetv/livetv.module';
import { StreamEvent } from './streamEvent.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([StreamEvent]),
        NflModule,
        MotorsportsModule,
        LiveTVModule
    ],
    providers: [],
    controllers: [],
})
export class StreamingModule {}