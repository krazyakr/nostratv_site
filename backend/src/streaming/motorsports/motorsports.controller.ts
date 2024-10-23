import { Controller, Get, Param } from '@nestjs/common';
import { MotorsportsService } from './motorsports.service';

@Controller('/streaming/motorsports')
export class MotorsportsController {
    constructor(
        private readonly motorsportsService: MotorsportsService
    ) {}

    @Get('events')
    async getEvents() {
        return this.motorsportsService.getAvailableEvents();
    }

    @Get('event/video/:eventUrl')
    async getVideo(@Param('eventUrl') eventUrl: string) {
        return this.motorsportsService.getVideoLinks(eventUrl);
    }
}