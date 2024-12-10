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

  private async getCategoryById(categoryId: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException("The category does not exist");
    }
    return category;
  }

  private isParentBudget(budget: Budget | null): boolean {
    if (budget instanceof Budget) return budget.budget_id ? false : true;
    return true;
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
    return result.childsum ? +result.childsum : 0;
  }

  async createBudget(
    createBudgetDto: CreateBudgetDto,
    userId: number
  ): Promise<Budget> {
    const generalCategoryId = 10; // 10 is for "general" category
    const { category_id, budget_id, amount, name } = createBudgetDto;
    const category = await this.getCategoryById(
      !category_id ? generalCategoryId : category_id
    );

    const parentBudget = budget_id ? await this.findOneById(budget_id) : null;
    const { startDate, endDate } = getFirstAndLastDayOfMonth();

    if (parentBudget && this.isParentBudget(parentBudget)) {
      // If creating a child budget...
      if (!createBudgetDto.amount)
        throw new ConflictException(
          "The amount has to be provided for a child budget"
        );

      if (!createBudgetDto.category_id)
        throw new ConflictException(
          "The category has to be provided for a child budget"
        );

      if (createBudgetDto.category_id === generalCategoryId)
        throw new ConflictException(
          `The category selected for a child budget cannot be of type "General" since it is only reserved for parent budgets`
        );
      //TODO: Add validation for the case in which the parent budget is from a past month or if it is not a parent

      // Starting a transaction for 1. Creating a budget and 2. updating the parent budget amount
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        // step 1
        const newBudget = queryRunner.manager.create(Budget, {
          name,
          amount: amount ? amount : 0,
          user: { id: userId },
          parent: parentBudget,
          category,
          startDate,
          endDate,
          isGeneral: false,
          isDeleted: false,
        });
        await queryRunner.manager.save(newBudget);

        // Step 2
        const sumChildAmounts =
          (await this.calculateChildBudgetsAmounts(parentBudget.id)) + amount;
        const updatedParentBudget = queryRunner.manager.merge(
          Budget,
          parentBudget,
          {
            amount: sumChildAmounts,
          }
        );
        await queryRunner.manager.save(updatedParentBudget);

        await queryRunner.commitTransaction();
        return newBudget;
      } catch (e) {
        await queryRunner.rollbackTransaction();
        throw new ConflictException("Transaction not completed: ", e);
      } finally {
        await queryRunner.release();
      }
    } else {
      // If creating a parent budget
      if (createBudgetDto.amount || createBudgetDto.category_id) {
        throw new BadRequestException(
          "A parent budget can only be created setting the name. Amount and category id cannot be set at creation."
        );
      }

      const newBudget = this.budgetRepository.create({
        name,
        amount: amount ? amount : 0,
        user: { id: userId },
        parent: null,
        category,
        startDate,
        endDate,
        isGeneral: false,
        isDeleted: false,
      });

      return await this.budgetRepository.save(newBudget);
    }
  }

  async getAll(userId: number): Promise<Budget[]> {
    const currentDate = getCurrentDate();

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
    const { budget_id, category_id, ...restDTO } = updateBudgetDto;
    const existingBudget = await this.findOneById(id);
    const currentAmount = +existingBudget.amount;
    if (!this.isParentBudget(existingBudget)) {
      // Child budget
      const category = category_id
        ? await this.getCategoryById(category_id)
        : existingBudget.category;

      const parentBudget = budget_id
        ? await this.findOneById(budget_id)
        : existingBudget.parent;
      // Starting a transaction for 1. Updating a budget and 2. updating the parent budget amount
      // TODO: Add service to update the parent budget's amount property

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        // Step 1: Update budget
        const udpatedBudget = queryRunner.manager.merge(
          Budget,
          existingBudget,
          {
            ...restDTO,
            category,
            parent: parentBudget,
          }
        );

        const response = await queryRunner.manager.save(udpatedBudget);

        //Step 2: Update parent amount
        if (restDTO.amount) {
          console.log(
            "\n\nawait this.calculateChildBudgetsAmounts(parentBudget.id): ",
            await this.calculateChildBudgetsAmounts(parentBudget.id)
          );
          console.log("restDTO.amount: ", restDTO.amount);
          console.log("existingBudget.amount: ", existingBudget.amount);
          console.log("currentAmount: ", currentAmount);

          const sumChildAmounts =
            (await this.calculateChildBudgetsAmounts(parentBudget.id)) +
            restDTO.amount -
            currentAmount;

          const updatedParentBudget = queryRunner.manager.merge(
            Budget,
            parentBudget,
            {
              amount: sumChildAmounts,
            }
          );
          await queryRunner.manager.save(updatedParentBudget);
        }

        await queryRunner.commitTransaction();
        return response;
      } catch (e) {
        await queryRunner.rollbackTransaction();
        throw new ConflictException("Transaction not completed: ", e);
      } finally {
        await queryRunner.release();
      }
    } else {
      // Parent budget
      if (budget_id || restDTO.amount || category_id) {
        throw new BadRequestException(
          "In a parent budget only the name can be edited."
        );
      }

      const updatedBudget = this.budgetRepository.merge(existingBudget, {
        ...restDTO, // Should only contain "name"
      });

      return await this.budgetRepository.save(updatedBudget);
    }
  }

  async deleteBudget(id: number): Promise<void> {
    //TODO: Check the budget to delete is not a parent, and if it is, delete all of its children
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
}
