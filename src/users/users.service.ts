import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as Argon2 from 'argon2';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private users: Repository<User>
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    return this.users.save(
      this.users.create({
        ...dto,
        password: await Argon2.hash(dto.password)
      })
    );
  }

  async findAll(): Promise<User[]> {
    return this.users.find();
  }

  async findById(id: string): Promise<User | null> {
    return this.users.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.users.findOneBy({ username });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.findOneBy({ email });
  }
}
