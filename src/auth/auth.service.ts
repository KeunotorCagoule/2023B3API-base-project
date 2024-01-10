import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as Argon2 from 'argon2';
import { LoginDto } from '../users/dto/login-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

export type AuthResponse = {
  access_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login({ email, password }: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException();
    if (!(await Argon2.verify(user.password, password)))
      throw new UnauthorizedException();

    return this.createToken(user);
  }

  async createToken(user: User): Promise<AuthResponse> {
    return this.jwtService
      .signAsync({ sub: user.id })
      .then((t) => Promise.resolve({ access_token: t }));
  }

  async verify(token: string): Promise<boolean> {
    const payload = await this.jwtService.verifyAsync(token);
    return !!payload;
  }

  async authUsingToken(authorHeader): Promise<User> {
    const token = extractToken(authorHeader);
    if (!token) throw new UnauthorizedException();

    const payload = await this.jwtService.verifyAsync(token);
    if (payload?.sub) {
      const user = await this.usersService.findById(payload.sub as string);

      if (user) return user;
    }

    throw new UnauthorizedException();
  }
}

function extractToken(authorHeader: string): string | null {
  const [type, tok] = authorHeader.split(' ');
  return type.toLowerCase() === 'bearer' ? tok : null;
}
