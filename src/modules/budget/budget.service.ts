import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Budget } from "./entities/budget.entity";

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>
  ) {}

  // async checkParent(parentId: number): Promise<boolean> {
  //   const existParent = await this.budgetRepository.findOne({
  //     where: { id: parentId },
  //   });
  //   if (!existParent) {
  //     throw new NotFoundException("The Budget general  doesn't exist");
  //   }
  //   return true;
  // }
  // async createBudget(
  //   createBudgetDto: CreateBudgetDto,
  //   userId: number
  // ): Promise<Budget> {
  //   if (createBudgetDto.budget_id !== null) {
  //     await this.checkParent(createBudgetDto.budget_id);

  //   }
  //   createBudgetDto.userId = userId
  //   const newBudget = this.budgetRepository.create( createBudgetDto);
  //   return await this.budgetRepository.save(newBudget);
  // }

  async findOne(id: number): Promise<Budget> {
    return await this.budgetRepository.findOne({ where: { id: id } });
  }
}
