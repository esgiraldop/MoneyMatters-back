import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class RegisterUserDto {
  @ApiProperty({ example: "Erick_test" })
  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: "name must be at least 5 characters long." })
  @MaxLength(30, { message: "must be at most 30 characters long." })
  name: string;

  @ApiProperty({ example: "Erick_test@email.com" })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: "12345678" })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: "Password must be at least 6 characters long." })
  @MaxLength(50, { message: "Password must be at most 50 characters long." })
  // @Matches(
  //   /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   {
  //     message:
  //       'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
  //   },
  // )
  password: string;
}
