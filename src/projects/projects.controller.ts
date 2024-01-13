import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  forwardRef,
  UnauthorizedException,
  HttpCode,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UsersService } from '../users/users.service';
import { ProjectUserService } from '../project-user/project-user.service';
import { AuthUser } from '../decorator/auth-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { Project } from './entities/project.entity';

@Controller('/projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly userService: UsersService,
    @Inject(forwardRef(() => ProjectUserService))
    private readonly projectUserService: ProjectUserService
  ) {}

  @Post()
  @HttpCode(201)
  async create(
    @AuthUser('role') role: UserRole,
    @Body() dto: CreateProjectDto
  ): Promise<Project> {
    if (role !== UserRole.ADMIN) {
      throw new UnauthorizedException();
    }
    return this.projectsService.create(dto);
  }

  @Get()
  async getAllProjects(@AuthUser() user: User): Promise<Project[]> {
    return this.projectsService.getByUser(user);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @AuthUser() user: User
  ): Promise<Project> {
    const project = await this.projectsService.getById(id);
    if (!project) throw new NotFoundException();

    const projects = await this.projectUserService.findByUser(user);
    if (!projects.some((p) => p.projectId === project.id))
      throw new ForbiddenException();
    return project;
  }
}
