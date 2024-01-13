import { Controller, Get, Post, Body, Param, forwardRef, Inject, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { AuthUser } from '../decorator/auth-user.decorator';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Events } from './entities/event.entity';
import dayjs from 'dayjs';


@Controller('/events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService
    ) {}

  @Post()
  async create(
    @AuthUser() user: User,
    @Body() dto: CreateEventDto
    ): Promise<Events> {
    
    const userName = await this.userService.findByUsername(user.username);
    const userEvents = await this.eventService.GetAllByUserId(userName.id);
    console.table(userEvents);

    if (dto.eventType === "RemoteWork") {
      const remote = userEvents.filter(event => event.eventType === "RemoteWork");
      if (remote.length == 2) {
        throw new UnauthorizedException();
      }
      dto["eventStatus"] = "Accepted";
    }

    userEvents.forEach((event) => {
      if (dayjs(event.date).isSame(dayjs(dto.date))) {
        throw new UnauthorizedException();
      }
    });

    return this.eventService.create(dto);
  }

  @Get()
  async getAllEvents(@AuthUser() user: User): Promise<Events[]> {
    return this.eventService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string,
  @AuthUser() user: User): Promise<Events> {
    const event = await this.eventService.getById(id);
    if (!event) throw new NotFoundException();

    return event;
  }
}
