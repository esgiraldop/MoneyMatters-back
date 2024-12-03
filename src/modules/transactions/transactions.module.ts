import { Module } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entity";
import { UsersModule } from "../users/users.module";
import { CategoryModule } from "../category/category.module";
import { BudgetModule } from "../budget/budget.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    UsersModule,
    CategoryModule,
    BudgetModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
