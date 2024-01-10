import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

export const AuthUser = createParamDecorator<keyof User>(
  (field: keyof User, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user ? (field ? req.user[field] : req.user) : null;
  }
);
