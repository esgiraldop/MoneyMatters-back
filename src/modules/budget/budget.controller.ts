import { CreateBudgetDto } from './dto/create-budget.dto';
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

  @Post()
  create(@Body() createBudgetDto: CreateBudgetDto, @UserId() userId: number) {
    return this.budgetService.create(createBudgetDto,userId);
  }

  @Get()
  findAll() {
    return this.budgetService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.budgetService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateBudgetDto: UpdateBudgetDto) {
    return this.budgetService.update(+id, updateBudgetDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.budgetService.remove(+id);
  }
}
