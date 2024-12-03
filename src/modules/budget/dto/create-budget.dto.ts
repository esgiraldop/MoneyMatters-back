import {
  IsInt,
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
} from "class-validator";

export class CreateBudgetDto {
  @IsOptional()
  @IsInt()
  budget_id?: number | null;

  @IsOptional()
  @IsString()
  name?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsBoolean()
  isGeneral?: boolean;

  @IsOptional()
  @IsInt()
  category_id: number | null;
}
