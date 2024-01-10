import { IsUUID, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID(4)
  referringEmployeeId: string;
}
