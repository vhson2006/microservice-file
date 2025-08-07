import { 
  Controller, Post, UploadedFile, UseInterceptors, UploadedFiles,
  ParseFilePipe, MaxFileSizeValidator, FileTypeValidator 
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CORRECT, INCORRECT } from 'src/assets/configs/app.constant';
import { Auth } from 'src/middlewares/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/middlewares/iam/authentication/enums/auth-type.enum';
import { ImageService } from './image.service';
import { Permissions } from 'src/middlewares/iam/authorization/decorators/permission.decoration';
import { CREATE } from 'src/assets/configs/app.permission';

@Auth(AuthType.Bearer)
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Permissions(`${CREATE.GROUP}.${CREATE.MEDIA}`)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 10000000 }), // 10MB
        new FileTypeValidator({ fileType: 'image/jpeg' }),
      ]
    })
  ) file: Express.Multer.File): Promise<any> {
    const media = await this.imageService.upload(file);
    if (INCORRECT === media) {
      return {
        status: INCORRECT,
        message: ''
      }
    }
    return {
      status: CORRECT,
      ...media
    }
  }

  @Permissions(`${CREATE.GROUP}.${CREATE.MEDIA}`)
  @Post('uploads')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 5 }]))
  async uploadFiles(@UploadedFiles(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 100000000 }), // 100MB
        new FileTypeValidator({ fileType: 'image/jpeg' }),
      ]
    })
  ) files: { files?: Express.Multer.File[] }): Promise<any> {    
    const media = await this.imageService.uploads(files.files);
    if (INCORRECT === media) {
      return {
        status: INCORRECT,
        message: ''
      }
    }
    return {
      status: CORRECT,
      ...media
    }
  }

}
