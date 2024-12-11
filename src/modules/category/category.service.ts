import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { In, Not, Repository } from "typeorm";
import { BudgetService } from "../budget/budget.service";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @Inject(forwardRef(() => BudgetService))
    private budgetService: BudgetService
  ) {}
  async findAll(
    userId: number,
    isNotUsed: boolean | null
  ): Promise<Category[]> {
    if (isNotUsed) {
      //return all categories that are not used already for budgets in the same month

      const usedCategories = await this.budgetService.getUsedCategories(userId);

      const usedCategoriesSet = [
        ...new Set(usedCategories.map((cat) => cat.categoryId)),
      ];

      return await this.categoryRepository.find({
        where: { id: Not(In(usedCategoriesSet)) },
      });
    }

    return await this.categoryRepository.find();
  }

  async findOneById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException("The category does not exist");
    }
    return category;
  }
}
