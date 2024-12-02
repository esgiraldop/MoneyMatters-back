import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { CreateBudgetDto } from "./dto/create-budget.dto";
import { UpdateBudgetDto } from "./dto/update-budget.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Budget } from "./entities/budget.entity";

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>
  ) {}

  async checkParent(userId: number): Promise<Budget | undefined> {
    const existingBudget = await this.budgetRepository.findOne({
      where: {
        user: { id: userId },
      },
      order: { id: "DESC" },
    });
    return existingBudget;
  }
  async create(
    createBudgetDto: CreateBudgetDto,
    userId: number
  ): Promise<Budget> {
    const existingBudget = await this.checkParent(userId);
    if (existingBudget) {
      createBudgetDto.amount += 1;
    }

    const newBudget = this.budgetRepository.create({
      ...createBudgetDto,
      user: { id: userId },
    });

    return await this.budgetRepository.save(newBudget);
  }

  findAll() {
    return `This action returns all budget`;
  }

  findOne(id: number) {
    return `This action returns a #${id} budget`;
  }

  update(id: number, updateBudgetDto: UpdateBudgetDto) {
    return `This action updates a #${id} budget`;
  }

  remove(id: number) {
    return `This action removes a #${id} budget`;
  }
}
