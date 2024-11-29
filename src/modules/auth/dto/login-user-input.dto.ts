import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserDto } from './register-user-input.dto';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto extends PartialType(RegisterUserDto) {
  @ApiProperty({ example: 'Erick_test@email.com' })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: '1234**?ABCasc' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
