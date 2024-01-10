import { Controller, Get, Post, Body, Param, UseGuards, ValidationPipe, UsePipes, Req, UnauthorizedException } from '@nestjs/common';
import { ProjectUserService } from './project-user.service';
import { CreatedProjectUserDto } from './dto/create-project-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('project-users')
export class ProjectUserController {
  constructor(private readonly projectUserService: ProjectUserService,
    private userService: UsersService) {}

  // @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  async create(@Req() req, @Body() createProjectUserDto: CreatedProjectUserDto) {
    const me = await this.userService.findUser(req.user.username);
    if (me.role === "Employee") {
      throw new UnauthorizedException();
    }
    return this.projectUserService.create(createProjectUserDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    console.log("oui")
    return this.projectUserService.findAll();
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectUserService.findOne(id);
  }
}
