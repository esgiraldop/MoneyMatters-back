import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { Repository } from "typeorm";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}
  findAll() {
    return `This action returns all category`;
  }

  async findOne(id: number): Promise<Category> {    return await this.categoryRepository.findOne({ where: { id: id } });
  }
}
