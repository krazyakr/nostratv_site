import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './device.entity';
import { DeviceController } from './device.controler';

@Module({
    imports: [
        TypeOrmModule.forFeature([Device]),
    ],
    providers: [DeviceService],
    controllers: [DeviceController],
})
export class DeviceModule {}