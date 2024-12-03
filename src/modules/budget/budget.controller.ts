import { CreateBudgetDto } from "./dto/create-budget.dto";
import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { BudgetService } from "./budget.service";
import { UserId } from "src/common/decorators/user.decorator";
import { JwtAuthGuard } from "src/common/guards/authentication.guard";

@Controller("budget")
@UseGuards(JwtAuthGuard)
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.budgetService.findOne(id);
  }

  @Post()
  async create(
    @Body() createBudgetDto: CreateBudgetDto,
    @UserId() userId: number
  ) {
    console.log(userId, "************");
    return this.budgetService.createBudget(createBudgetDto, userId);
  }
}
