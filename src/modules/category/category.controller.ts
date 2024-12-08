import { Controller, Get, Param } from "@nestjs/common";
import { CategoryService } from "./category.service";

@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }
  @Get(":id")
  findOne(@Param("id") id: number) {
    console.log("hola");
    return this.categoryService.findOne(id);
  }
}
