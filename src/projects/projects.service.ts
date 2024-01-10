import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';
import { ProjectUserService } from '../project-user/project-user.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    @Inject(forwardRef(() => ProjectUserService))
    private readonly projectUser: ProjectUserService
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    const user = await this.userService.findById(dto.referringEmployeeId);
    if (user.role === UserRole.EMPLOYEE) {
      throw new UnauthorizedException();
    }

    const newProject = this.projectsRepository.create({
      ...dto,
      referringEmployee: user
    });
    return this.projectsRepository.save(newProject);
  }

  async getByUser(user: User): Promise<Project[]> {
    return this.projectUser
      .findByUser(user)
      .then((a) => Promise.resolve(a.map((b) => b.project)));
  }

  async getById(id: string): Promise<Project | null> {
    return this.projectsRepository.findOneBy({ id });
  }
}
