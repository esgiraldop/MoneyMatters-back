import {
  IsInt,
  IsNumber,
  IsString,
  IsOptional,
  IsPositive,
} from "class-validator";

export class CreateBudgetDto {
  @IsOptional()
  @IsInt()
  budget_id?: number | null;

  @IsString()
  name: string;

  @IsPositive({ message: "The amount cannot be negative" })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount?: number;

  @IsOptional()
  @IsInt({ message: "The category id must be an integer" })
  category_id?: number | null;

  // // Commented out this since the date of insertion is enough to calculate the first and last day of the month
  // @IsOptional()
  // @IsDateString()
  // startDate: string;

  // @IsOptional()
  // @IsDateString()
  // endDate?: string;
}
