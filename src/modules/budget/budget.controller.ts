import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
  Query,
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
  async getAll(
    @UserId() userId: number,
    @Query("filterByName") filterByName: string | null
  ) {
    return this.budgetService.getAll(userId, filterByName);
  }

  @Get(":id")
  async findOne(@UserId() userId: number, @Param("id") id: number) {
    return this.budgetService.findOneById(id, userId);
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
