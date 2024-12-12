import { forwardRef, Module } from "@nestjs/common";
import { BudgetService } from "./budget.service";
import { BudgetController } from "./budget.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Budget } from "./entities/budget.entity";
import { CategoryModule } from "../category/category.module";
import { TransactionsModule } from "../transactions/transactions.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Budget]),
    forwardRef(() => CategoryModule),
    // CategoryModule,
    forwardRef(() => TransactionsModule),
  ],
  controllers: [BudgetController],
  providers: [BudgetService],
  exports: [BudgetService],
})
export class BudgetModule {}
