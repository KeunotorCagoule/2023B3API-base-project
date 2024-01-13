import { Module, forwardRef } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { UsersModule } from '../users/users.module';
import { Events } from './entities/event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [EventController],
  providers: [EventService],
  imports: [
    TypeOrmModule.forFeature([Events]),
    forwardRef(() => UsersModule),
  ]
})
export class EventModule {}
