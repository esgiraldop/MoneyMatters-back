import { Module } from "@nestjs/common";
import { BudgetService } from "./budget.service";
import { BudgetController } from "./budget.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Budget } from "./entities/budget.entity";
import { Category } from "../category/entities/category.entity";
import { CategoryService } from "../category/category.service";

@Module({
  imports: [TypeOrmModule.forFeature([Budget, Category])],
  controllers: [BudgetController],
  providers: [BudgetService, CategoryService],
})
export class BudgetModule {}
