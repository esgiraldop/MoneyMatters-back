import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
} from "@nestjs/common";
import { BudgetService } from "./budget.service";
import { CreateBudgetDto } from "./dto/create-budget.dto";
import { UpdateBudgetDto } from "./dto/update-budget.dto";
import { UserId } from "src/common/decorators/user.decorator";
import { JwtAuthGuard } from "src/common/guards/authentication.guard";

@Controller("budgets")
@UseGuards(JwtAuthGuard)
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get()
  async getAll(@UserId() userId: number) {
    return this.budgetService.getAll(userId);
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    return this.budgetService.findOneById(id);
  }

  @Post()
  async create(
    @Body() createBudgetDto: CreateBudgetDto,
    @UserId() userId: number
  ) {
    return this.budgetService.createBudget(createBudgetDto, userId);
  }

  @Patch(":id")
  async update(
    @Param("id") id: number,
    @Body() updateBudgetDto: UpdateBudgetDto
  ) {
    return this.budgetService.updateBudget(id, updateBudgetDto);
  }

  @Delete(":id")
  async delete(@Param("id") id: number) {
    return this.budgetService.deleteBudget(id);
  }
}
