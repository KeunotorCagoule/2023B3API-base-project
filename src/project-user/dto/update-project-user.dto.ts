import { PartialType } from '@nestjs/swagger';
import { CreatedProjectUserDto } from './create-project-user.dto';

export class UpdateProjectUserDto extends PartialType(CreatedProjectUserDto) {}
