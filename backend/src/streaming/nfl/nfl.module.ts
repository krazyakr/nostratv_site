import { Module } from '@nestjs/common';
import { NflService } from './nfl.service';
import { NflController } from './nfl.controler';

@Module({
    imports: [],
    providers: [NflService],
    controllers: [NflController],
})
export class NflModule {}