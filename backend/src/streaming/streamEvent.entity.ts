import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum StreamCategory {
  LIVETV = 'livetv',
  MOTORSPORTS = 'motorsports',
  NFL = 'nfl'
}

@Entity()
export class StreamEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 512, nullable: false })
  url: string;

  @Column({
    type: 'enum',
    enum: StreamCategory,
    default: StreamCategory.LIVETV
  })
  category: StreamCategory;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}