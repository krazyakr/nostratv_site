import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './app.config';
import { DeviceModule } from './device/device.module';
import { StreamingModule } from './streaming/streaming.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [__dirname + '/../**/*.entity.js'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    DeviceModule,
    StreamingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
