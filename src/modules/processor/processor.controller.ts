import { Controller } from '@nestjs/common';
import { ProcessorService } from './processor.service';
import { Auth } from 'src/middlewares/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/middlewares/iam/authentication/enums/auth-type.enum';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Permissions } from 'src/middlewares/iam/authorization/decorators/permission.decoration';
import { VIEW } from 'src/assets/configs/app.permission';

@Auth(AuthType.Bearer)
@Controller()
export class ProcessorController {
  constructor(private readonly processorService: ProcessorService) {}
  
  @Permissions(`${VIEW.GROUP}.${VIEW.MEDIA}`)
  @EventPattern('cloudinaryUpload')
  async cloudinaryUpload(@Payload() data: any) {
    return await this.processorService.cloudinaryUpload(data)
  }
    
  @Permissions(`${VIEW.GROUP}.${VIEW.MEDIA}`)
  @MessagePattern('retrieveAvatar')
  async signUp(@Payload() data: any) {
    return await this.processorService.retrieveAvatar(data)
  }
}
