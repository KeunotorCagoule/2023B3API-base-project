import { IsUUID, IsNotEmpty, MinLength } from 'class-validator';


export class CreateProjectDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsUUID(4)
  referringEmployeeId: string;
}
