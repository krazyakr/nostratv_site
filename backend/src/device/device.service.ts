import { InjectRepository } from "@nestjs/typeorm";
import { Device } from "./device.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcryptjs';
import { InternalServerErrorException, Logger } from "@nestjs/common";

export class DeviceService {
    private readonly logger = new Logger(DeviceService.name);
    
    constructor(
        @InjectRepository(Device)
        private deviceRepository: Repository<Device>
    ) {}

    async getAllDevices(): Promise<Device[]> {
        return this.deviceRepository.find();
    }

    async createDevice(deviceName: string, password: string, iptvLink?: string): Promise<Device> {
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

        this.logger.debug(`Fetching IPTV content from ${device.iptvLink}`);
        const response = await fetch(device.iptvLink);
        if (!response.ok) {
            throw new InternalServerErrorException('Failed to fetch IPTV content', response.statusText);
        }

        const content = await response.text();
        return content;
    }

    async updateDevice(device: Device, password: string, iptvLink: string): Promise<void> {
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