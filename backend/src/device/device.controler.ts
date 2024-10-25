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
        this.logger.log('Fetching all devices');
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
        this.logger.log(`Creating device with name ${deviceName}`);
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
        this.logger.log(`Updating device with name ${deviceName}`);

        await this.deviceService.updateDevice(deviceName, password, iptvLink);
        return { message: 'Device updated successfully' };
    }

    @Get('/:deviceName')
    async getDevice(@Param('deviceName') deviceName: string) {
        this.logger.log(`Fetching device with name ${deviceName}`);
        
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
        this.logger.log(`Fetching IPTV content from device with name ${deviceName}`);
        const content = await this.deviceService.getDeviceIptvContent(deviceName, password);
        if (!content) {
            throw new NotFoundException('Device not found or password incorrect');
        }

        const fileName = "iptv_channels.m3u";
        res.set('Content-Disposition', 'attachment; filename="' + fileName + '"');
        return res.send(content);
    }

    @Get('/:deviceName/:password/iptv/:group')
    async getDeviceIptvContentByGroup(
        @Param('deviceName') deviceName: string,
        @Param('password') password: string,
        @Param('group') group: string,
        @Res() res: Response
    ) {
        this.logger.log(`Fetching IPTV content from device with name ${deviceName} for group ${group}`);
        const content = await this.deviceService.getDeviceIptvGroupContent(deviceName, password, group);
        if (!content) {
            throw new NotFoundException('Device not found or password incorrect');
        }

        const fileName = `iptv_channels_${group}.m3u`;
        res.set('Content-Disposition', 'attachment; filename="' + fileName + '"');
        return res.send(content);
    }
}