import { DataSource, Repository } from "typeorm";
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
import {
  getCurrentDate,
  getFirstAndLastDayOfMonth,
} from "src/common/utilities/dates.utility";
import { CategoryService } from "../category/category.service";

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
    private dataSource: DataSource,
    // @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService
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
    const category = await this.categoryService.findOneById(
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

  async getAll(userId: number, filterByName: string | null): Promise<Budget[]> {
    const currentDate = getCurrentDate();

    const query = this.budgetRepository
      .createQueryBuilder("budget")
      .leftJoinAndSelect("budget.category", "category")
      .leftJoinAndSelect("budget.parent", "parent")
      .leftJoinAndSelect("budget.user", "user")
      .where("budget.user_id = :user_id", { user_id: userId })
      .andWhere("budget.isDeleted = :isDeleted", { isDeleted: false })
      .andWhere(":currentDate BETWEEN budget.startDate AND budget.endDate", {
        currentDate,
      });

    if (filterByName) {
      query.andWhere("budget.name LIKE :filterByName", {
        filterByName: `%${filterByName}%`,
      });
    }

    return await query.getMany();
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
        ? await this.categoryService.findOneById(category_id)
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
    //Check the budget to delete is it is a parent budget. If yes, delete it and delete all of its childrens. If not, delete it and update its parent budget amount attribute.

    const budget = await this.findOneById(id);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    if (!this.isParentBudget(budget)) {
      // Starting transaction to 1. Soft delete the budget and 2. Update the parent value
      try {
        // Step 1
        queryRunner.manager.merge(Budget, budget, { isDeleted: true });
        await this.budgetRepository.save(budget);

        //Step 2
        const childSum =
          (await this.calculateChildBudgetsAmounts(budget.budget_id)) -
          +budget.amount;
        const parentBudget = await this.findOneById(budget.budget_id);
        const updatedParentBudget = queryRunner.manager.merge(
          Budget,
          parentBudget,
          { amount: childSum }
        );
        await queryRunner.manager.save(updatedParentBudget);
        await queryRunner.commitTransaction();
        return;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new ConflictException("Transaction not completed: ", error);
      } finally {
        if (!queryRunner.isReleased) {
          await queryRunner.release();
        }
      }
    } else {
      // Starting transaction to 1. Soft delete the budget and 2. Soft delete the child budgets
      try {
        //Step 1
        const updatedBudget = queryRunner.manager.merge(Budget, budget, {
          isDeleted: true,
        });
        await queryRunner.manager.save(updatedBudget);

        await queryRunner.manager
          .getRepository(Budget)
          .createQueryBuilder()
          .update(Budget)
          .set({ isDeleted: true })
          .where("budget_id = :id", { id: budget.id })
          .execute();

        await queryRunner.commitTransaction();
        return;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new ConflictException("Transaction not completed: ", error);
      } finally {
        if (!queryRunner.isReleased) await queryRunner.release();
      }
    }
  }

  async restoreBudget(id: number): Promise<Budget> {
    const budget = await this.findOneById(id);
    budget.isDeleted = false;
    return await this.budgetRepository.save(budget);
  }

  async getUsedCategories(userId: number): Promise<{ categoryId: number }[]> {
    // Gets all the categories used by a user in the current month according to their budgets
    const currentDate = getCurrentDate();
    return this.budgetRepository
      .createQueryBuilder("budget")
      .leftJoinAndSelect("budget.category", "category")
      .select("category.id", "categoryId")
      .where("budget.user_id = :user_id", { user_id: userId })
      .andWhere(":currentDate BETWEEN budget.startDate AND budget.endDate", {
        currentDate,
      })
      .getRawMany();
  }
}
