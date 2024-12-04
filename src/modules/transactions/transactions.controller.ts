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
  findAll(@UserId() userId: string) {
    return this.transactionsService.findAll(+userId);
  }

  @Get(":id")
  findOne(@UserId() userId: string, @Param("id") id: string) {
    return this.transactionsService.findOne(+userId, +id);
  }

  @Patch(":id")
  update(
    @UserId() userId: string,
    @Param("id") id: string,
    @Body() updateTransactionDto: UpdateTransactionDto
  ) {
    return this.transactionsService.update(+userId, +id, updateTransactionDto);
  }

  @Delete(":id")
  remove(@UserId() userId: string, @Param("id") id: string) {
    return this.transactionsService.remove(+userId, +id);
  }
}
