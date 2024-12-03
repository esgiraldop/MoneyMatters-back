import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transaction } from "./entities/transaction.entity";
import { UsersService } from "../users/users.service";
import { BudgetService } from "../budget/budget.service";
import { CategoryService } from "../category/category.service";
import { isDateInCurrentMonth } from "src/common/utilities/check-date-in-current-month.utility";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private usersService: UsersService,
    private budgetService: BudgetService,
    private categoryService: CategoryService
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    user_id: number
  ): Promise<Transaction> {
    const { amount, description, transactionDate, category_id, budget_id } =
      createTransactionDto;
    if (!isDateInCurrentMonth(transactionDate))
      throw new ConflictException(
        "The transaction could not be created since the date is not in the same month"
      );
    // Find user, category and budget by id
    const user = await this.usersService.findById(user_id);
    if (!user)
      throw new NotFoundException(
        `The user with id ${user_id} could not be found`
      );

    const category = await this.transactionRepository.findOne({
      where: { id: createTransactionDto.category_id },
    });
    if (!category)
      throw new NotFoundException(
        `The category with id ${category_id} could not be found`
      );

    const budget = await this.budgetService.findOne(budget_id);
    if (!budget)
      throw new NotFoundException(
        `The budget with id ${budget_id} could not be found`
      );

    if (user && category && budget) {
      const createdData = this.transactionRepository.create({
        amount,
        transactionDate,
        description,
        user,
        category,
        budget,
      });
      return await this.transactionRepository.save(createdData);
    }
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  async update(
    id: number,
    updateTransactionDto: UpdateTransactionDto
  ): Promise<Transaction> {
    const { category_id, budget_id, ...rest } = updateTransactionDto;
    if (rest.transactionDate && !isDateInCurrentMonth(rest.transactionDate))
      throw new ConflictException(
        "The transaction could not be created since the date is not in the same month"
      );

    const category = await this.transactionRepository.findOne({
      where: { id: category_id },
    });
    if (!category)
      throw new NotFoundException(
        `The category with id ${category_id} could not be found`
      );

    const budget = await this.budgetService.findOne(budget_id);
    if (!budget)
      throw new NotFoundException(
        `The budget with id ${budget_id} could not be found`
      );

    if (category && budget) {
      const transaction = await this.transactionRepository.findOne({
        where: { id },
      });
      if (!transaction)
        throw new NotFoundException("The transaction could not be found");
      const updatedTransaction = this.transactionRepository.merge(transaction, {
        ...rest,
        category,
        budget,
      });
      return this.transactionRepository.save(updatedTransaction);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
