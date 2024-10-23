import { Controller, Get, Post, Body, BadRequestException, NotFoundException, Param, Res, Put } from '@nestjs/common';
import { DeviceService } from './device.service';
import { Logger } from '@nestjs/common';
import { Response } from 'express';

@Controller('device')
export class DeviceController {
    private readonly logger = new Logger(DeviceController.name);

    constructor(private deviceService: DeviceService) {}
    
    @Get('/')
    async getAllDevices() {
        const devices = await this.deviceService.getAllDevices();
        return devices.map(device => ({
            id: device.id,
            deviceName: device.deviceName,
            iptvLink: device.iptvLink
        }));
    }

    @Post('/')
    async createDevice(
        @Body('deviceName') deviceName: string,
        @Body('password') password: string,
        @Body('iptvLink') iptvLink?: string
    ) {
        // Check if the device already exists
        const existingDevice = await this.deviceService.findDeviceBydeviceName(deviceName);
        if (existingDevice) {
            throw new BadRequestException('Device already exists');
        }

        // Create the device
        const device = await this.deviceService.createDevice(deviceName, password, iptvLink);
        return { message: 'Device created successfully', data: {
            id: device.id,
            deviceName: device.deviceName,
            iptvLink: device.iptvLink
        } };
    }

    @Put('/:deviceName')
    async updateDevice(
        @Param('deviceName') deviceName: string,
        @Body('password') password?: string,
        @Body('iptvLink') iptvLink?: string
    ) {
        const device = await this.deviceService.findDeviceBydeviceName(deviceName);
        if (!device) {
            throw new NotFoundException('Device not found');
        }

        await this.deviceService.updateDevice(device, password, iptvLink);
        return { message: 'Device updated successfully' };
    }

    @Get('/:deviceName')
    async getDevice(@Param('deviceName') deviceName: string) {
        const device = await this.deviceService.findDeviceBydeviceName(deviceName);
        if (!device) {
            throw new NotFoundException('Device not found');
        }

        return {
            id: device.id,
            deviceName: device.deviceName,
            iptvLink: device.iptvLink
        };
    }

    @Get('/:deviceName/:password/iptv')
    async getDeviceIptvContent(
        @Param('deviceName') deviceName: string,
        @Param('password') password: string,
        @Res() res: Response
    ) {
        const content = await this.deviceService.getDeviceIptvContent(deviceName, password);
        if (!content) {
            throw new NotFoundException('Device not found or password incorrect');
        }

        const fileName = "iptv_channels.m3u";
        res.set('Content-Disposition', 'attachment; filename="' + fileName + '"');
        return res.send(content);
    }
}