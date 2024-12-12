import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, FindOptionsWhere, In, Like, Repository } from "typeorm";
import { Transaction } from "./entities/transaction.entity";
import { UsersService } from "../users/users.service";
import { BudgetService } from "../budget/budget.service";
import { CategoryService } from "../category/category.service";
import { isDateInCurrentMonth } from "src/common/utilities/check-date-in-current-month.utility";
import { getFirstAndLastDayOfMonth } from "src/common/utilities/dates.utility";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private usersService: UsersService,
    @Inject(forwardRef(() => BudgetService))
    private budgetService: BudgetService,
    private categoryService: CategoryService
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    user_id: number
  ): Promise<Transaction> {
    const { amount, description, transactionDate, budget_id } =
      createTransactionDto;
    if (!isDateInCurrentMonth(transactionDate))
      throw new ConflictException(
        "The transaction could not be created since the date is not in the same month"
      );
    // Find user, category and budget by id
    const user = await this.usersService.findById(user_id);
    if (!user) throw new NotFoundException(`The user could not be found`);

    const budget = await this.budgetService.findOneById(budget_id, user_id);

    if (this.budgetService.isParentBudget(budget)) {
      throw new ConflictException(
        `A transaction cannot be added to a parent budget`
      );
    }

    if (!budget) throw new NotFoundException(`The budget could not be found`);

    // Category inserted is the same one from the budget to keep consistency
    const category = await this.categoryService.findOneById(budget.category.id);
    if (!category)
      throw new NotFoundException(`The category could not be found`);

    if (user && category && budget) {
      const createdData = this.transactionRepository.create({
        amount,
        transactionDate,
        description,
        user,
        category,
        budget,
        isActive: true, // true by default
      });
      return await this.transactionRepository.save(createdData);
    }
  }

  async findAll(
    userId: number,
    filterByName?: string | null,
    currentMonthOnly?: boolean | null
  ): Promise<Transaction[]> {
    const { startDate, endDate } = getFirstAndLastDayOfMonth();

    const whereCondition: FindOptionsWhere<Transaction> = {
      user: { id: userId },
    };

    if (currentMonthOnly) {
      whereCondition.transactionDate = Between(
        new Date(startDate),
        new Date(endDate)
      );
    }

    if (filterByName) {
      whereCondition.name = Like(`%${filterByName}%`);
    }

    const transactions = await this.transactionRepository.find({
      where: whereCondition,
      relations: ["budget", "category"],
    });

    return transactions;
  }

  async findOne(userId: number, id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ["budget", "category"],
    });

    if (!transaction)
      throw new NotFoundException(`The transaction could not be found`);

    return transaction;
  }

  async update(
    userId: number,
    id: number,
    updateTransactionDto: UpdateTransactionDto
  ): Promise<Transaction> {
    const { budget_id, ...rest } = updateTransactionDto;
    let category, updatedTransaction;

    if (rest.transactionDate && !isDateInCurrentMonth(rest.transactionDate))
      throw new ConflictException(
        "The transaction could not be created since the date is not in the same month"
      );

    if (budget_id) {
      const budget = await this.budgetService.findOneById(budget_id);
      if (!budget) throw new NotFoundException(`The budget could not be found`);
      category = await this.categoryService.findOneById(budget.category.id);
      if (!category)
        throw new NotFoundException(`The category could not be found`);
    }

    const transaction = await this.findOne(userId, id);
    if (!category) {
      updatedTransaction = this.transactionRepository.merge(transaction, {
        ...updateTransactionDto,
      });
    } else {
      updatedTransaction = this.transactionRepository.merge(transaction, {
        ...rest,
        category,
      });
    }
    if (updatedTransaction)
      return await this.transactionRepository.save(updatedTransaction);

    throw new ConflictException("The transaction could not be updated");
  }

  async remove(userId: number, id: number) {
    const transaction = await this.findOne(userId, id);

    const updatedTransaction = this.transactionRepository.merge(transaction, {
      isActive: false,
    });
    return await this.transactionRepository.save(updatedTransaction);
  }

  async findByBudgetIds(budgetIds: number[]) {
    return await this.transactionRepository.find({
      where: { budget: { id: In(budgetIds) } },
    });
  }
}
