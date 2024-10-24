import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './device.entity';
import { DeviceController } from './device.controler';
import { CacheService } from './cache.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Device])
    ],
    providers: [DeviceService, CacheService],
    controllers: [DeviceController],
})
export class DeviceModule {}