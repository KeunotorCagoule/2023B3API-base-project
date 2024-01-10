import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }
      })
    })
  ],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
