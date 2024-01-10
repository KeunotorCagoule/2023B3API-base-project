import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';

export class CreatedProjectUserDto {
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsNotEmpty()
  @IsUUID(4)
  projectId: string;

  @IsNotEmpty()
  @IsUUID(4)
  userId: string;
}
