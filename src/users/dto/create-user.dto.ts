import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;

  @IsEnum(UserRole)
  @IsOptional()
  readonly role?: UserRole;
}
