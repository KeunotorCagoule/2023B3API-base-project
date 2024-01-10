import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef
} from '@nestjs/common';
import { CreatedProjectUserDto } from './dto/create-project-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectUser } from './entities/project-user.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProjectUserService {
  constructor(
    @InjectRepository(ProjectUser)
    private readonly projectUserRepository: Repository<ProjectUser>,
    @Inject(forwardRef(() => ProjectsService))
    private readonly projectService: ProjectsService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService
  ) {}

  async create(dto: CreatedProjectUserDto): Promise<ProjectUser> {
    const project = await this.projectService.getById(dto.projectId);
    if (!project) throw new NotFoundException();

    const user = await this.userService.findById(dto.userId);
    if (!user) throw new NotFoundException();

    const newProjectUser = this.projectUserRepository.create(dto);

    const assignation = await this.projectUserRepository.findBy({userId: user.id})
    for (const assign of assignation){
      const overlap = Math.max(
        Math.min(dto.endDate.getTime(), assign.endDate.getTime()) - Math.max(dto.startDate.getTime(), assign.startDate.getTime()), 0
      )

      if (overlap > 0) throw new ConflictException();
    }
    return this.projectUserRepository.save(newProjectUser);
  }

  async findAll(): Promise<ProjectUser[]> {
    return this.projectUserRepository.find();
  }

  async findOne(id: string): Promise<ProjectUser | null> {
    return this.projectUserRepository.findOneBy({ id });
  }

  async findByUser(user: User): Promise<ProjectUser[]> {
    if (user.role === UserRole.EMPLOYEE) {
      return this.projectUserRepository.findBy({
        userId: user.id
      });
    }
    return this.findAll();
  }
}
