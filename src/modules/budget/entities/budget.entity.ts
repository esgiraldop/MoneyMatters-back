import { Category } from "src/modules/category/entities/category.entity";
import { Transaction } from "src/modules/transactions/entities/transaction.entity";
import { User } from "src/modules/users/entities/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";

@Entity("budgets")
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", nullable: true })
  budget_id: number | null;

  @ManyToOne(() => Budget, (budget) => budget.children, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "budget_id" })
  parent: Budget | null;

  @OneToMany(() => Budget, (budget) => budget.parent, { nullable: true })
  children: Budget[];

  @Column({ type: "varchar", length: 255, nullable: false })
  name: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  amount: number;

  @Column({ type: "date" })
  startDate: string;

  @Column({ type: "date" })
  endDate: string;

  @Column({ type: "boolean", default: false })
  isGeneral: boolean;

  @ManyToOne(() => User, (user) => user.budgets)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Category, (category) => category.budgets, { nullable: true })
  @JoinColumn({ name: "category_id" })
  category: Category;

  @OneToMany(() => Transaction, (transaction) => transaction.budget)
  transactions: Transaction[];

  @Column({ type: "boolean", default: false, nullable: false })
  isDeleted: boolean;
}
