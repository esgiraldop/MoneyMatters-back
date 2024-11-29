import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user-input.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiPostOperation } from 'src/common/decorators/post-swagger.decorator';
import { LoginUserDto } from './dto/login-user-input.dto';
import { LoginResponseDto } from './dto/login-user-output.dto';
import { RegisterResponseDto } from './dto/register-user-output.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiPostOperation(
    'Register successfull',
    RegisterResponseDto,
    RegisterUserDto,
    false,
  )
  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @ApiPostOperation('login successfully', LoginResponseDto, LoginUserDto, false)
  @Post('login')
  loginUser(@Body() loginUserdto: LoginUserDto): Promise<LoginResponseDto> {
    return this.authService.loginUser(loginUserdto);
  }
}
