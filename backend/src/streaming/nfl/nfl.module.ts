import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NflService } from './nfl.service';
import { NflController } from './nfl.controller';
import { StreamEvent } from '../streamEvent.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([StreamEvent])
    ],
    providers: [NflService],
    controllers: [NflController],
})
export class NflModule {}