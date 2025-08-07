import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CLOUDINARY } from 'src/assets/configs/app.constant';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { I18nService } from 'src/middlewares/globals/i18n/i18n.service';
import { Media } from 'src/entities/media.entity';
import { MediaStatus } from 'src/entities/media-status.entity';
import { MEDIA_STATUS } from 'src/assets/configs/app.common';

@Injectable()
export class ProcessorService {
  constructor(
    private readonly configService: ConfigService,
    private readonly i18nService: I18nService,
    @InjectRepository(Media) private readonly mediaRepository: Repository<Media>,
    @InjectRepository(MediaStatus) private readonly mediaStatusRepository: Repository<MediaStatus>,
    @Inject(CLOUDINARY.PROVIDER) private readonly cloudinary: any,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
  ) {}
  
  async cloudinaryUpload(data: any) {
    try {
      this.logger.debug(`Start upload avatar: ${JSON.stringify(data)}`);
      const { secure_url } = await this.cloudinary.uploader.upload(
        data.path,
        { folder: this.configService.get('cloudinary.folder') },
        function (err: any) {
          if (err) {
            this.logger.error(`${JSON.stringify(err)}`);
          }
        },
      );
      const updateMediaResponse = await this.mediaRepository.update(
        data.id, 
        { url: secure_url }
      );
      if (updateMediaResponse.affected > 0) {
        this.logger.debug(`Upload avatar completed: ${JSON.stringify(data)}`);
      } else {
        this.logger.debug(`Upload avatar can't process: ${JSON.stringify(data)}`);
      }
    } catch(err) {
      this.logger.error(`Upload avatar error: ${JSON.stringify(err)}`);
    }
  }

  async retrieveAvatar(data: any) {
    try {
      const { id } = data
      const { id: mediaStatusId} = await this.mediaStatusRepository.findOne({
        where: {
          type: MEDIA_STATUS.ASSIGN,
          group: MEDIA_STATUS.GROUP
        }
      })
      await this.mediaRepository.update(id, { statusId: mediaStatusId });
      const {url} = await this.mediaRepository.findOne({where: { id }})

      return url
    } catch(err) {
      this.logger.error(`Upload avatar error: ${JSON.stringify(err)}`);
    }
  }

}
