import { Module } from '@nestjs/common';
import { LiveTvController } from './livetv.controller';
import { LiveTVService } from './livetv.service';

@Module({
    imports: [],
    controllers: [LiveTvController],
    providers: [LiveTVService],
})

export class LiveTVModule {}