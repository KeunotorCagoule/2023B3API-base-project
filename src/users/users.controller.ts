import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import { BADQUERY } from 'dns';
import { error } from 'node:console';
import { isString } from 'class-validator';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login-user.dto';

const bcrypt = require('bcrypt');

@Controller('users')
export class UsersController {
  [x: string]: any;
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post('/auth/sign-up')
  async signUp(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.create({
      ...dto,
      password: bcrypt.hashSync(dto.password, 10),
    });
  }

  @Post('auth/login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.login(body);
    if (!user || !bcrypt.compareSync(body.password, user.password)) {
      throw new UnauthorizedException();
    }
    return this.authService.authenticate(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Req() req) {
    return await this.usersService.findUser(req.user.username);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
