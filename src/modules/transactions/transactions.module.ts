import { Module } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entity";
import { UsersModule } from "../users/users.module";
import { CategoryModule } from "../category/category.module";
import { BudgetModule } from "../budget/budget.module";
import { BudgetService } from "../budget/budget.service";
import { Budget } from "../budget/entities/budget.entity";
import { Category } from "../category/entities/category.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Budget, Category]),
    UsersModule,
    CategoryModule,
    BudgetModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, BudgetService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
