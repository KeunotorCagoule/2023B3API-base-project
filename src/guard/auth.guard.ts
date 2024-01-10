import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth/auth.service';
import { PublicRoute } from '../decorator/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflect: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflect.getAllAndOverride(PublicRoute, [
      context.getClass(),
      context.getHandler(),
    ]);

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    if (req.headers.authorization) {
      const user = await this.authService.authUsingToken(
        req.headers.authorization,
      );

      if (user) {
        req['user'] = user;
        return true;
      }
    }

    throw new UnauthorizedException();
  }
}
