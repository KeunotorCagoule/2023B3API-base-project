import { Module, forwardRef } from '@nestjs/common';
import { ProjectUserService } from './project-user.service';
import { ProjectUserController } from './project-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { ProjectUser } from './entities/project-user.entity';
import { ProjectsModule } from '../projects/projects.module';


@Module({
  controllers: [ProjectUserController],
  providers: [ProjectUserService],
  imports: [
    TypeOrmModule.forFeature([ProjectUser]),
    forwardRef(() => UsersModule),
    forwardRef(() => ProjectsModule),

  ],
  exports: [ProjectUserService],
})
export class ProjectUserModule {}
