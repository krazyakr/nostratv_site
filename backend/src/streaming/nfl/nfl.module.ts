import { Module } from '@nestjs/common';
import { NflService } from './nfl.service';
import { NflController } from './nfl.controller';

@Module({
    imports: [],
    providers: [NflService],
    controllers: [NflController],
})
export class NflModule {}