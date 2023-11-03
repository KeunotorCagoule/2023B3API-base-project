import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(3)
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;
  
  @MinLength(8)
  password: string;
  role?: 'Employee' | 'Admin' | 'ProjectManager';
}
