import { Controller, Get, Post, Body, Param, forwardRef, Inject, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { AuthUser } from '../decorator/auth-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
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
      dto["userId"] = user.id;
    
    //const userName = await this.userService.findByUsername(user.username);
    const userEvents = await this.eventService.GetAllByUserId(user.id);
    console.table(userEvents)

    if (dto.eventType === 'RemoteWork') {
      const remote = userEvents.filter(event => event.eventType === "RemoteWork");
      if (remote.length == 2) {
        console.table("FCHGVJKBLJOMIGYFTYXFGJ?V BJNK?L")
        throw new UnauthorizedException();
      }
      dto["eventStatus"] = "Accepted";
    }

    userEvents.forEach(event => {
      if (dayjs(event.date).isSame(dto.date, 'day')) {
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

  @Get("/user/:id")
  async getId(@Param('id') id: string, @AuthUser() user: User): Promise<Events[]> {
    console.log("user.id : ", user.id )
    return await this.eventService.GetAllByUserId(user.id)
  }

  @Get('/:id/validate')
  async validateEvent(@Param('id') id: string,
  @AuthUser('role') role: UserRole): Promise<Events> {
    if (role === 'Employee') {
      throw new UnauthorizedException();
    }
    const event = await this.eventService.getById(id);
    if (!event) throw new NotFoundException();

    event.eventStatus = "Accepted";
    return this.eventService.validate(id, event);
  }
}
