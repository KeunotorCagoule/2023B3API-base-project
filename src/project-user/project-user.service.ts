import { Injectable } from '@nestjs/common';
import { CreatedProjectUserDto } from './dto/create-project-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectUser } from './entities/project-user.entity';


@Injectable()
export class ProjectUserService {
  constructor(
    @InjectRepository(ProjectUser)
    private projectUserRepository: Repository<ProjectUser>,
  ) {}

  create(createProjectUserDto: CreatedProjectUserDto) {
    const newProjectUser =
      this.projectUserRepository.create(createProjectUserDto);
    return this.projectUserRepository.save(newProjectUser);
  }

  findAll() {
    return this.projectUserRepository.find();
  }

  findOne(id: string) {
    return this.projectUserRepository.find({
      where: {
        id: id,
      },
    });
  }

  getAllByEmployeeId(id: string) {
    return this.projectUserRepository.find({
      where: {
        userId: id,
      },
    });
  }
}
