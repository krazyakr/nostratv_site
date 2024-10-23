import { Controller, Get, Param } from '@nestjs/common';
import { LiveTVService } from './livetv.service';

@Controller('streaming/livetv')
export class LiveTvController {
    constructor(
        private readonly liveTvService: LiveTVService
    ) {}

    @Get('events')
    async getEvents() {
        return this.liveTvService.getAvailableMatches();
    }

    @Get('event/video/:eventUrl')
    async getVideo(@Param('eventUrl') eventUrl: string) {
        return this.liveTvService.getMatchStream(eventUrl);
    }
}