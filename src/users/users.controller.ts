import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  forwardRef
} from '@nestjs/common';
import { AuthResponse, AuthService } from '../auth/auth.service';
import { AuthUser } from '../decorator/auth-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { User, UserRole } from './entities/user.entity';
import { UsersService } from './users.service';
import { PublicRoute } from '../decorator/public.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) {}

  @Post()
  async post(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  @Get()
  async getAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @PublicRoute()
  @Post('/auth/sign-up')
  async signUp(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  @PublicRoute()
  @Post('/auth/login')
  async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  @Get('/me')
  async getCurrentUser(@AuthUser() user: User) {
    console.table(user);
    return user;
  }

  @Get('/:id')
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException();
    return user;
  }
}
