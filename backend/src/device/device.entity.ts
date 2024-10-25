

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Device {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    deviceName: string;

    @Column()
    password: string;

    @Column()
    salt: string;

    @Column({ nullable: true })
    iptvLink: string;
}