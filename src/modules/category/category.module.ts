import { forwardRef, Module } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryController } from "./category.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { BudgetModule } from "../budget/budget.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    // forwardRef(() => BudgetModule),
    BudgetModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
