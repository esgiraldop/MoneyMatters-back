import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty({ message: "The ammount must not be empty" })
  @IsPositive({ message: "The ammount must be a positive number" })
  amount: number;

  @IsNotEmpty({ message: "The name must not be empty" })
  @MinLength(3, { message: "The name must have at least three characters" })
  @MaxLength(30, { message: "The name must have 30 characters maximum" })
  @IsString({ message: "The name must be a string" })
  name: string;

  @IsString({ message: "The description must be a string" })
  description: string;

  @IsDateString()
  transactionDate: Date;

  @IsInt({ message: "The budget id must be an integer" })
  @IsPositive({ message: "The category id must be a positive number" })
  @IsNotEmpty({ message: "The budget id must not be empty" })
  budget_id: number;
}
