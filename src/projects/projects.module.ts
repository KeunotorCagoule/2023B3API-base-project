import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef } from '@nestjs/common';
import { ProjectUserModule } from '../project-user/project-user.module';
import { UsersModule } from "../users/users.module";


@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    UsersModule,
    forwardRef(() => ProjectUserModule),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
