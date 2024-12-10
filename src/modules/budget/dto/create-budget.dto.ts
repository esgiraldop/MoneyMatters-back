import { IsInt, IsNumber, IsString, IsOptional } from "class-validator";

export class CreateBudgetDto {
  @IsOptional()
  @IsInt()
  budget_id?: number | null;

  @IsString()
  name: string;

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
