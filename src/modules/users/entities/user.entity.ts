import { Budget } from "src/modules/budget/entities/budget.entity";
import { RecoveryCode } from "src/modules/recovery-codes/entities/recovery-code.entity";
import { Transaction } from "src/modules/transactions/entities/transaction.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Budget, (budget) => budget.user)
  budgets: Budget[];

  @OneToMany(( ) => RecoveryCode, (recoveryCode) => recoveryCode.user)
  recoveryCodes: RecoveryCode[];
}
