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
  @IsPositive({ message: "The budget id cannot be negative" })
  budget_id?: number | null;

  @IsString()
  name: string;

  @IsPositive({ message: "The amount cannot be negative" })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount?: number;

  @IsPositive({ message: "The category id cannot be negative" })
  @IsOptional()
  @IsInt({ message: "The category id must be an integer" })
  category_id?: number | null;
}
