import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/modules/users/entities/user.entity";
import { Repository } from "typeorm";
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginUserDto } from "../dto/login-user-input.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async checkPassword(loginUserDto: LoginUserDto): Promise<User> {
    const userData = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
      // relations: ["role"],
    });

    if (!userData) {
      throw new ConflictException("The user does not exist");
    }

    if (!bcrypt.compareSync(loginUserDto.password, userData.password)) {
      throw new UnauthorizedException("Invalid password");
    }

    return userData;
  }

  async generateToken(
    userId: number
    // roleId: number
  ) {
    const payload = {
      userId,
      // roleId
    };
    const access_token = await this.jwtService.signAsync(payload);
    return {
      message: "Login successfull. This is your token",
      token: access_token,
    };
  }
}
