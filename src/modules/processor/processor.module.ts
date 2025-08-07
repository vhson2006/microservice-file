import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY, FILESYSTEM_SERVICE } from 'src/assets/configs/app.constant';
import { I18nService } from 'src/middlewares/globals/i18n/i18n.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProcessorController } from './processor.controller';
import { ProcessorService } from './processor.service';
import { MediaStatus } from 'src/entities/media-status.entity';
import { Media } from 'src/entities/media.entity';
import { Common } from 'src/entities/common.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaStatus, Media, Common]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get('global.temp'),
      }),
      inject: [ConfigService],
    }),
    ClientsModule.register([
      {
        name: FILESYSTEM_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: process.env.NATS_URL,
        },
      },
    ]),
  ],
  providers: [
    {
      provide: CLOUDINARY.PROVIDER,
      useFactory: async (configService: ConfigService) => {
        cloudinary.config({
          cloud_name: configService.get('cloudinary.name'),
          api_key: configService.get('cloudinary.apiKey'),
          api_secret: configService.get('cloudinary.apiSecret'),
        })
        return cloudinary;
      },
      inject: [ConfigService],
    },
    I18nService,
    ProcessorService
  ],
  controllers: [ProcessorController],
})
export class ProcessorModule {}
