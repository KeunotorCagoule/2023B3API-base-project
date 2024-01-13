import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { ProjectUser } from './project-user/entities/project-user.entity';
import { Project } from './projects/entities/project.entity';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { ProjectUserModule } from './project-user/project-user.module';
import { ProjectsModule } from './projects/projects.module';
import { EventModule } from './event/event.module';
import { Events } from './event/entities/event.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local']
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, ProjectUser, Project, Events],
        synchronize: true
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    ProjectUserModule,
    EventModule,
    AuthModule,
    ProjectsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true })
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    }
  ]
})
export class AppModule {}
