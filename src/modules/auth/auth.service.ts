import { RegisterUserDto } from "./dto/register-user-input.dto";
import { LoginService } from "./services/login.service";
import { RegisterService } from "./services/register.service";
import { Injectable } from "@nestjs/common";
import { LoginUserDto } from "./dto/login-user-input.dto";
import { LoginResponseDto } from "./dto/login-user-output.dto";

@Injectable()
export class AuthService {
  constructor(
    private registerService: RegisterService,
    private loginService: LoginService
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    return await this.registerService.register(registerUserDto);
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const userData = await this.loginService.checkPassword(loginUserDto);

    return await this.loginService.generateToken(
      userData.id
    );
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
