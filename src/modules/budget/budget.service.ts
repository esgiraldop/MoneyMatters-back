import { Between, DataSource, Repository } from "typeorm";
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Budget } from "./entities/budget.entity";
import { CreateBudgetDto } from "./dto/create-budget.dto";
import { UpdateBudgetDto } from "./dto/update-budget.dto";
import { Category } from "../category/entities/category.entity";
import {
  getCurrentDate,
  getFirstAndLastDayOfMonth,
} from "src/common/utilities/dates.utility";

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private dataSource: DataSource
  ) {}

  async findOneById(id: number): Promise<Budget> {
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
    const parentBudget = await this.findOneById(parentId);
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

  private isParentBudget(parentBudget: Budget): boolean {
    return parentBudget.budget_id ? false : true;
  }

  private async calculateChildBudgetsAmounts(
    parentBudgetId: number
  ): Promise<number> {
    await this.findOneById(parentBudgetId); //Sanity check
    const result = await this.budgetRepository
      .createQueryBuilder("budget")
      .where("budget.budget_id = :budget_id", { budget_id: parentBudgetId })
      .select("SUM(budget.amount)", "childsum")
      .getRawOne();
    return result.childsum ? result.childsum : 0;
  }

  async createBudget(
    createBudgetDto: CreateBudgetDto,
    userId: number
  ): Promise<Budget> {
    const category = await this.checkCategory(
      !createBudgetDto.category_id ? 10 : createBudgetDto.category_id
    ); // 10 is for "general" category

    const parentBudget = createBudgetDto.budget_id
      ? await this.checkParent(createBudgetDto.budget_id)
      : null;

    const { startDate, endDate } = getFirstAndLastDayOfMonth();

    if (parentBudget) {
      // If creating a child budget...
      if (!createBudgetDto.amount)
        throw new ConflictException(
          "The amount has to be provided for a child budget"
        );

      if (!createBudgetDto.category_id)
        throw new ConflictException(
          "The category has to be provided for a child budget"
        );

      // Starting a transaction for 1. Creating a budget and 2. updating the parent budget
      // const queryRunner = this.dataSource.createQueryRunner();
      // await queryRunner.connect();
      // await queryRunner.startTransaction();
      // try {
      //   await queryRunner.manager.save(Order, {
      //     /* order data */
      //   });
      //   await queryRunner.manager.save(Item, {
      //     /* item data */
      //   });
      //   await queryRunner.commitTransaction();
      // } catch (e) {
      //   await queryRunner.rollbackTransaction();
      //   throw e;
      // } finally {
      //   await queryRunner.release();
      // }
    } else {
      // If creating a parent budget
      if (createBudgetDto.amount || createBudgetDto.category_id) {
        throw new BadRequestException(
          "A parent budget can only be created setting the name. Amount and category id cannot be set at creation."
        );
      }
      // TODO: Add service to update the parent budget's amount property
      const newBudget = this.budgetRepository.create({
        ...createBudgetDto,
        user: { id: userId },
        parent: null,
        category,
        startDate,
        endDate,
      });

      return await this.budgetRepository.save(newBudget);
    }
  }

  async getAll(userId: number): Promise<Budget[]> {
    const currentDate = getCurrentDate();
    console.log("currentDate: ", currentDate);
    return await this.budgetRepository
      .createQueryBuilder("budget")
      .leftJoinAndSelect("budget.category", "category")
      .leftJoinAndSelect("budget.parent", "parent")
      .leftJoinAndSelect("budget.user", "user")
      .where("budget.user_id = :user_id", { user_id: userId })
      .andWhere("budget.isDeleted = :isDeleted", { isDeleted: false })
      .andWhere(":currentDate BETWEEN budget.startDate AND budget.endDate", {
        currentDate,
      })
      .getMany();
  }

  async updateBudget(
    id: number,
    updateBudgetDto: UpdateBudgetDto
  ): Promise<Budget> {
    const existingBudget = await this.findOneById(id);

    const isChildBudget = existingBudget.parent !== null;

    if (!isChildBudget) {
      if (updateBudgetDto.amount) {
        throw new BadRequestException(
          "In a parent budget only the name can be created. The Amount be modifief."
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
    // TODO: Add service to update the parent budget's amount property
    Object.assign(existingBudget, {
      ...updateBudgetDto,
      category,
      parent: parentBudget,
    });

    return await this.budgetRepository.save(existingBudget);
  }

  async deleteBudget(id: number): Promise<void> {
    const budget = await this.findOneById(id);
    // TODO: Add service to update the parent budget's amount property
    budget.isDeleted = true;
    await this.budgetRepository.save(budget);
  }

  async restoreBudget(id: number): Promise<Budget> {
    const budget = await this.findOneById(id);
    budget.isDeleted = false;
    return await this.budgetRepository.save(budget);
  }

  async permanentlyDeleteBudget(id: number): Promise<void> {
    const budget = await this.findOneById(id);
    await this.budgetRepository.remove(budget);
  }
}
