import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { UserId } from "src/common/decorators/user.decorator";
import { JwtAuthGuard } from "src/common/guards/authentication.guard";

@Controller("categories")
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(
    @UserId() userId: number,
    @Query("isNotUsed") isNotUsed: boolean | null
  ) {
    return this.categoryService.findAll(+userId, isNotUsed);
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.categoryService.findOneById(id);
  }
}
