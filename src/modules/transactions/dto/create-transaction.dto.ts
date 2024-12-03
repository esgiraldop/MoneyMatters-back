import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from "class-validator";

export class CreateTransactionDto {
  @IsNumber()
  @IsNotEmpty({ message: "The ammount must not be empty" })
  @IsPositive({ message: "The ammount must be a positive number" })
  amount: number;

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
