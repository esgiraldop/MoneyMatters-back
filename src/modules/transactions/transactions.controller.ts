import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { UserId } from "src/common/decorators/user.decorator";
import { JwtAuthGuard } from "src/common/guards/authentication.guard";

@Controller("transactions")
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @UserId() userId: string
  ) {
    return this.transactionsService.create(createTransactionDto, +userId);
  }

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateTransactionDto: UpdateTransactionDto
  ) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.transactionsService.remove(+id);
  }
}
