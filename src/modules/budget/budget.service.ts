import { Repository } from "typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Budget } from "./entities/budget.entity";
import { CreateBudgetDto } from "./dto/create-budget.dto";
import { Category } from "../category/entities/category.entity";

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async checkParent(parentId: number): Promise<boolean> {
    const existParent = await this.budgetRepository.findOne({
      where: { id: parentId },
    });
    if (!existParent) {
      throw new NotFoundException("The Budget general  doesn't exist");
    }
    return true;
  }

  async createBudget(
    createBudgetDto: CreateBudgetDto,
    userId: number
  ): Promise<Budget> {
    let category = null;
    if (createBudgetDto.category_id) {
      category = await this.categoryRepository.findOne({
        where: { id: createBudgetDto.category_id },
      });
      if (!category) {
        throw new NotFoundException("Category does not exist");
      }
    }

    let parentBudget = null;
    if (createBudgetDto.budget_id !== null) {
      parentBudget = await this.budgetRepository.findOne({
        where: { id: createBudgetDto.budget_id },
      });
    }

    const newBudget = this.budgetRepository.create({
      ...createBudgetDto,
      user: { id: userId },
      parent: parentBudget,
      category,
    });

    return await this.budgetRepository.save(newBudget);
  }

  async findOne(id: number): Promise<Budget> {
    return await this.budgetRepository.findOne({ where: { id: id } });
  }
}
