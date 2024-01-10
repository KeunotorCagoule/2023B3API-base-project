import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UnauthorizedException,
  forwardRef
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreatedProjectUserDto } from './dto/create-project-user.dto';
import { ProjectUserService } from './project-user.service';
import { AuthUser } from '../decorator/auth-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { ProjectUser } from './entities/project-user.entity';

@Controller('/project-users')
export class ProjectUserController {
  constructor(
    private readonly projectUserService: ProjectUserService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService
  ) {}

  @Post()
  async create(
    @AuthUser('role') role: UserRole,
    @Body() dto: CreatedProjectUserDto
  ): Promise<ProjectUser> {
    if (role === 'Employee') {
      throw new UnauthorizedException();
    }
    return this.projectUserService.create(dto);
  }

  @Get()
  async findAll(@AuthUser() user: User): Promise<ProjectUser[]> {
    return this.projectUserService.findByUser(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projectUserService.findOne(id);
  }
}
