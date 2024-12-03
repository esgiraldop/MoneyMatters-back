import { CreateBudgetDto } from "./dto/create-budget.dto";
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { BudgetService } from "./budget.service";
import { UpdateBudgetDto } from "./dto/update-budget.dto";
import { UserId } from "src/common/decorators/user.decorator";

@Controller("budget")
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.budgetService.findOne(id);
  }
}
