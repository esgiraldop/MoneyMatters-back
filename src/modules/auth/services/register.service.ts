import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/modules/users/entities/user.entity";
import { RegisterUserDto } from "../dto/register-user-input.dto";
import { Repository } from "typeorm";
import { RegisterResponseDto } from "../dto/register-user-output.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  async register(
    registerUserDto: RegisterUserDto
  ): Promise<RegisterResponseDto> {
    const { email, password } = registerUserDto;
    const usersbyEmail = await this.userRepository.find({
      where: { email },
      // relations: ['role'],
    });

    if (usersbyEmail.length > 0) {
      throw new ConflictException(
        `The user with email ${registerUserDto.email} already exists`
      );
    }

    // Encrypting password
    const salt = bcrypt.genSaltSync();

    const userData = this.userRepository.create({
      ...registerUserDto,
      password: bcrypt.hashSync(password, salt),
      isVerified: false, // Not verified by default
      // role: { id: 2 },
    });

    await this.userRepository.save(userData);

    return {
      message:
        "Registration in progress. Please validate your email with the code we just sent to your email.",
    };
  }
}
