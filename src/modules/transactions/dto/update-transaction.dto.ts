import { PartialType } from "@nestjs/swagger";
import { CreateTransactionDto } from "./create-transaction.dto";
import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsInt({ message: "The category id must be an integer" })
  @IsPositive({ message: "The category id must be a positive number" })
  @IsNotEmpty({ message: "The category id must not be empty" })
  category_id: number;
}
