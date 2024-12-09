import { Repository } from "typeorm";
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Budget } from "./entities/budget.entity";
import { CreateBudgetDto } from "./dto/create-budget.dto";
import { UpdateBudgetDto } from "./dto/update-budget.dto";
import { Category } from "../category/entities/category.entity";

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  private async validateBudgetExists(id: number): Promise<Budget> {
    const budget = await this.budgetRepository.findOne({
      where: { id, isDeleted: false },
      relations: ["category", "parent"],
    });
    if (!budget) {
      throw new NotFoundException("Budget not found");
    }
    return budget;
  }

  private async checkParent(parentId: number): Promise<Budget> {
    const parentBudget = await this.validateBudgetExists(parentId);
    return parentBudget;
  }

  private async checkCategory(categoryId: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException("The category does not exist");
    }
    return category;
  }

  async createBudget(
    createBudgetDto: CreateBudgetDto,
    userId: number
  ): Promise<Budget> {
    const category = createBudgetDto.category_id
      ? await this.checkCategory(createBudgetDto.category_id)
      : null;

    const parentBudget = createBudgetDto.budget_id
      ? await this.checkParent(createBudgetDto.budget_id)
      : null;

    if (parentBudget && createBudgetDto.amount) {
      if (parentBudget.amount < createBudgetDto.amount) {
        throw new BadRequestException(
          "A child budget's amount cannot exceed the parent's budget amount."
        );
      }
    }

    if (!parentBudget) {
      if (
        createBudgetDto.amount ||
        createBudgetDto.startDate ||
        createBudgetDto.endDate
      ) {
        throw new BadRequestException(
          "A parent budget can only be created setting the name. Amount and Date cannot be set at creation."
        );
      }
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
    return await this.validateBudgetExists(id);
  }

  async getAll(userId: number): Promise<Budget[]> {
    return await this.budgetRepository
      .createQueryBuilder("budget")
      .leftJoinAndSelect("budget.category", "category")
      .leftJoinAndSelect("budget.parent", "parent")
      .leftJoinAndSelect("budget.user", "user")
      .where("budget.userId = :userId", { userId })
      .andWhere("budget.isDeleted = :isDeleted", { isDeleted: false })
      .getMany();
  }

  async updateBudget(
    id: number,
    updateBudgetDto: UpdateBudgetDto
  ): Promise<Budget> {
    const existingBudget = await this.validateBudgetExists(id);

    const isChildBudget = existingBudget.parent !== null;

    if (!isChildBudget) {
      if (
        updateBudgetDto.amount ||
        updateBudgetDto.startDate ||
        updateBudgetDto.endDate
      ) {
        throw new BadRequestException(
          "In a parent budget only the name can be created. The Amount and Date cannot be modifief."
        );
      }
    }

    if (isChildBudget && updateBudgetDto.amount) {
      if (existingBudget.parent.amount < updateBudgetDto.amount) {
        throw new BadRequestException(
          "A child budget's amount cannot exceed the parent's budget amount."
        );
      }
    }
    const category = updateBudgetDto.category_id
      ? await this.checkCategory(updateBudgetDto.category_id)
      : existingBudget.category;

    const parentBudget = updateBudgetDto.budget_id
      ? await this.checkParent(updateBudgetDto.budget_id)
      : existingBudget.parent;

    Object.assign(existingBudget, {
      ...updateBudgetDto,
      category,
      parent: parentBudget,
    });

    return await this.budgetRepository.save(existingBudget);
  }

  async deleteBudget(id: number): Promise<void> {
    const budget = await this.validateBudgetExists(id);
    budget.isDeleted = true;
    await this.budgetRepository.save(budget);
  }

  async restoreBudget(id: number): Promise<Budget> {
    const budget = await this.validateBudgetExists(id);
    budget.isDeleted = false;
    return await this.budgetRepository.save(budget);
  }

  async permanentlyDeleteBudget(id: number): Promise<void> {
    const budget = await this.validateBudgetExists(id);
    await this.budgetRepository.remove(budget);
  }
}
