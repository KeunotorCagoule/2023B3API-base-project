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

const bcrypt = require('bcrypt');

@Controller('users')
export class UsersController {
  [x: string]: any;
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllUsers(): {} {
    return this.usersService.findAll();
  }

  @Post('/auth/sign-up')
  @UsePipes(new ValidationPipe())
  signUp(@Body() createUserDto: CreateUserDto) {
    let user: CreateUserDto = {
      username: createUserDto.username,
      password: bcrypt.hashSync(createUserDto.password, 10),
      email: createUserDto.email,
      role: createUserDto.role,
    };
    return this.usersService.create(user);
  }

  @Post('auth/login')
  async login(@Body() body) {
    const user = await this.usersService.authenticate(body.email);
    if (!user || !bcrypt.compareSync(body.password, user.password)) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getProfile(@Req() req) {
    return await this.usersService.findUser(req.user.username);
  }

  @Get(':id')
  async findOne(@Req() req) {
    // const user = await this.UserService.FindOneById(req.id);
    // if (!user) {
    //   throw new HttpException(error, HttpStatus.NOT_FOUND);
    // }
    // if (isString(req.id)) {
    //   throw new HttpException(error, HttpStatus.BAD_REQUEST);
    // }
    return this.usersService.findOne(req.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
