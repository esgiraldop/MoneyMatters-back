import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolesEnum } from "./enums/roles.enum";

@Entity("roles")
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: RolesEnum })
  name: RolesEnum;

  // @OneToMany(() => User, (user) => user.role)
  // users: User[];
}
