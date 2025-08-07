import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { FILESYSTEM_SERVICE, INCORRECT, MAX_SIZE, QUEUE } from 'src/assets/configs/app.constant';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MEDIA_STATUS } from 'src/assets/configs/app.common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { I18nService } from 'src/middlewares/globals/i18n/i18n.service';
import { MediaStatus } from 'src/entities/media-status.entity';
import { Media } from 'src/entities/media.entity';
import { ClientProxy } from '@nestjs/microservices';
import { natsRecord } from 'src/assets/utils/nats';

@Injectable()
export class ImageService {
  constructor(
    private readonly i18nService: I18nService,
    @InjectRepository(Media) private readonly mediaRepository: Repository<Media>,
    @InjectRepository(MediaStatus) private readonly mediaStatusRepository: Repository<MediaStatus>,
    @Inject(FILESYSTEM_SERVICE) private readonly natsMessageBroker: ClientProxy,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: LoggerService,
  ) {}
  
  async upload(file: Express.Multer.File) {
    try {
      const { id } = await this.mediaStatusRepository.findOne({
        where: {
          type: MEDIA_STATUS.NEW,
          group: MEDIA_STATUS.GROUP
        }
      })

      const { identifiers } = await this.mediaRepository.insert({
        name: file.originalname,
        url: '',
        alt: file.originalname,
        fileType: file.mimetype,
        statusId: id
      })

      if (Array.isArray(identifiers) && identifiers.length > 0) {
        this.natsMessageBroker.emit(
          'cloudinaryUpload', 
          natsRecord({
            path: file.path, 
            id: identifiers[0].id,
          })
        );

        return {
          id: identifiers[0].id,
          url: ''
        }
      }

      return INCORRECT
    } catch (e) {
      return INCORRECT
    }
  }

  async uploads(files: Express.Multer.File[]) {
    try {
      const uploads = await files.reduce(async (pre: any, cur: any) => {
        const res = await this.upload(cur);
        if (res === INCORRECT) {
          return pre
        }
        return [
          ...pre,
          res
        ]
      }, []);

      if ( Array.isArray(uploads) && uploads.length > 0) {
        return uploads;
      }

      return INCORRECT
    } catch (e) {
      return INCORRECT
    }
  }
}
