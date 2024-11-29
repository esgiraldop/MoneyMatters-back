import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { LoginService } from './services/login.service';
import { RegisterService } from './services/register.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot(), // Make sure to initialize ConfigModule
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule here
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('TOKEN_EXPIRATION'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LoginService, RegisterService],
})
export class AuthModule {}
