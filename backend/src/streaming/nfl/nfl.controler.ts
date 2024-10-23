import { Controller, Get, Param } from '@nestjs/common';
import { NflService } from './nfl.service';

@Controller('/streaming/nfl')
export class NflController {
    constructor(private readonly nflService: NflService) {}

    @Get('events')
    async getEvents() {
        return this.nflService.getAvailableEvents();
    }

    @Get('event/video/:eventUrl')
    async getVideo(@Param('eventUrl') eventUrl: string) {
        return this.nflService.getVideoLinks(eventUrl);
    }
}
