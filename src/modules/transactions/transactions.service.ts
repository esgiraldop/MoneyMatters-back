import { Injectable } from "@nestjs/common";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transaction } from "./entities/transaction.entity";
import { UsersService } from "../users/users.service";
import { BudgetService } from "../budget/budget.service";
import { CategoryService } from "../category/category.service";

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

    // Find user, category and budget by id
    const user = await this.usersService.findById(user_id);
    const category = await this.categoryService.findOne(category_id);
    const budget = await this.budgetService.findOne(budget_id);
    console.log("\n\n\nuser: ", user);
    console.log("category: ", category);
    console.log("budget: ", budget);
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

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
