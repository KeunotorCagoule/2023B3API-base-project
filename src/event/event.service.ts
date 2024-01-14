import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { Events } from './entities/event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Events)
    private readonly eventRepository: Repository<Events>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService
  ) {}

  async create(dto: CreateEventDto): Promise<Events> {

    const newEvent = this.eventRepository.create(dto);

    return this.eventRepository.save(newEvent);
  }

  async findAll(): Promise<Events[]> {
    return this.eventRepository.find();
  }

  async GetAllByUserId(id: string): Promise<Events[]> {
    const userEvents = await this.eventRepository.find({
      where: {
        userId: id
      }
    });
    return userEvents;
  }

  async getById(id: string): Promise<Events | null> {
    return this.eventRepository.findOneBy({ id });
  }

  async validate(id: string, dto: CreateEventDto): Promise<Events> {
    const event = await this.getById(id);
    if (!event) {
      throw new NotFoundException();
    }

    return this.eventRepository.save({ ...event, ...dto });
  }
}
