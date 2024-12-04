import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  Min,
} from "class-validator";

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty({ message: "The ammount must not be empty" })
  @IsPositive({ message: "The ammount must be a positive number" })
  amount: number;

  @IsNotEmpty({ message: "The name must not be empty" })
  @Min(3, { message: "The name must have at least three characters" })
  @Max(30, { message: "The name must have 30 characters maximum" })
  @IsString({ message: "The name must be a string" })
  name: string;

  @IsString({ message: "The description must be a string" })
  description: string;

  @IsDateString()
  transactionDate: Date;

  @IsInt({ message: "The category id must be an integer" })
  @IsPositive({ message: "The category id must be a positive number" })
  @IsNotEmpty({ message: "The category id must not be empty" })
  category_id: number;

  @IsInt({ message: "The budget id must be an integer" })
  @IsPositive({ message: "The category id must be a positive number" })
  @IsNotEmpty({ message: "The budget id must not be empty" })
  budget_id: number;
}
