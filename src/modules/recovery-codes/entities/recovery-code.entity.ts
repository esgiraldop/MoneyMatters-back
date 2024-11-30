import { User } from "src/modules/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("recovery_codes")
export class RecoveryCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date" })
  initDate: Date;

  @Column({ type: "boolean", default: "true" })
  isValid: boolean;

  @ManyToOne(( ) => User, (user) => user.recoveryCodes)
  user: User;
}
