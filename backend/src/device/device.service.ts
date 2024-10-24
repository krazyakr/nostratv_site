import { InjectRepository } from "@nestjs/typeorm";
import { Device } from "./device.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { BadRequestException, InternalServerErrorException, Logger, NotFoundException, Injectable } from "@nestjs/common";
import { CacheService } from './cache.service';

@Injectable()
export class DeviceService {
    private readonly logger = new Logger(DeviceService.name);
    private cacheService: CacheService;

    constructor(
        @InjectRepository(Device)
        private deviceRepository: Repository<Device>,
    ) {
        this.cacheService = new CacheService(this.fetchIptvContent.bind(this));
    }

    async getAllDevices(): Promise<Device[]> {
        return this.deviceRepository.find();
    }

    async createDevice(deviceName: string, password: string, iptvLink?: string): Promise<Device> {
        // Check if the device already exists
        const existingDevice = await this.findDeviceBydeviceName(deviceName);
        if (existingDevice) {
            throw new BadRequestException('Device already exists');
        }

        // Generate a salt
        const salt = await bcrypt.genSalt();
        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(password, salt);

        const device = this.deviceRepository.create({
            deviceName,
            password: hashedPassword,
            salt,
            iptvLink
        });

        // Save the device to the database
        return this.deviceRepository.save(device);
    }

    async findDeviceBydeviceName(deviceName: string): Promise<Device> {
        return this.deviceRepository.findOne({ where: { deviceName } });
    }

    async getDeviceIptvContent(deviceName: string, password: string): Promise<string> {
        const device = await this.findDeviceBydeviceName(deviceName);
        if (!device) {
            return null;
        }

        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, device.password);
        if (!isPasswordCorrect) {
            return null;
        }

        // Check cache first
        const cacheKey = `iptvContent:${deviceName}`;
        let cachedContent = this.cacheService.get(cacheKey);
        if (cachedContent) {
            this.logger.debug(`Returning cached IPTV content for ${deviceName}`);
            return cachedContent;
        }

        // Fetch and cache content
        const content = await this.fetchIptvContent(cacheKey);
        this.cacheService.set(cacheKey, content);

        return content;
    }

    private async fetchIptvContent(cacheKey: string): Promise<string> {
        const deviceName = cacheKey.split(':')[1];
        const device = await this.findDeviceBydeviceName(deviceName);
        if (!device) {
            throw new Error(`Device not found: ${deviceName}`);
        }

        this.logger.debug(`Fetching IPTV content from ${device.iptvLink}`);
        const response = await fetch(device.iptvLink);
        if (!response.ok) {
            throw new InternalServerErrorException('Failed to fetch IPTV content', response.statusText);
        }

        return await response.text();
    }

    async updateDevice(deviceName: string, password: string, iptvLink: string): Promise<void> {
        const device = await this.findDeviceBydeviceName(deviceName);

        if (!device) {
            throw new NotFoundException('Device not found');
        }

        this.logger.debug(`Updating device with name ${deviceName} with password ${password} and IPTV link ${iptvLink}`);
        
        if (password) {
            // Generate a salt
            const salt = await bcrypt.genSalt();
            // Hash the password with the salt
            const hashedPassword = await bcrypt.hash(password, salt);

            device.password = hashedPassword;
            device.salt = salt;
        }

        if (iptvLink) {
            device.iptvLink = iptvLink;
        }

        await this.deviceRepository.save(device);
    }
}