import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: false, length: 255 })
  email: string;

  @Column({ type: "varchar", nullable: false, length: 30 })
  password: string;

  // @ManyToOne(() => Role, (role) => role.id)
  // @JoinColumn({ name: 'roleId' })
  // role: Role;
}
