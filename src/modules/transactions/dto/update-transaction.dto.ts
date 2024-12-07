import { PartialType } from "@nestjs/swagger";
import { CreateTransactionDto } from "./create-transaction.dto";
import { IsInt, IsNotEmpty, IsPositive } from "class-validator";

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
