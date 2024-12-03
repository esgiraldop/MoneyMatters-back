import { IsDateString } from "class-validator";
import { Budget } from "src/modules/budget/entities/budget.entity";
import { Category } from "src/modules/category/entities/category.entity";
import { User } from "src/modules/users/entities/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "date" })
  @IsDateString()
  transactionDate: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Category, (category) => category.transactions)
  @JoinColumn({ name: "category_id" })
  category: Category;

  @ManyToOne(() => Budget, (budget) => budget.transactions)
  @JoinColumn({ name: "budget_id" })
  budget: Budget;
}
