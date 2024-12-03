import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";

@Injectable()
export class SeedersService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager
  ) {}

  async insertCategories(): Promise<void> {
    const categories = [
      "Rent",
      "Food",
      "Snacks",
      "Public services",
      "Public transportation",
      "Car expenses",
      "Gasoline",
      "Car loan",
      "Mortgage",
      "General",
      "University",
      "Credit cards",
      "Other",
      "Taxes",
      "Household repairs",
      "Pet food",
      "Clothing",
      "Savings",
      "Health insurance",
      "Gym membership",
      "Haircuts",
      "Salon services",
      "Cosmetics",
      "Subscriptions",
      "Personal loans",
      "Investing",
    ];

    const existingCategories = await this.entityManager.query(`
      SELECT name FROM categories WHERE name IN (${categories.map((c) => `'${c}'`).join(", ")})
    `);

    const existingNames = existingCategories.map(
      (category: any) => category.name
    );

    const newCategories = categories.filter(
      (category) => !existingNames.includes(category)
    );

    if (newCategories.length === 0) {
      console.log("All categories already exist, skipping insertion.");
      return;
    }

    const values = newCategories
      .map((category, index) => `(${index + 1}, '${category}')`)
      .join(", ");

    await this.entityManager.query(`
      INSERT INTO categories (id, name) VALUES ${values}
    `);

    console.log(`Inserted ${newCategories.length} new categories.`);
  }
}
