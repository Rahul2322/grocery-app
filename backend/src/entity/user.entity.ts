import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique,
} from "typeorm";
import { Order } from "./order.entity";
import { Exclude } from "class-transformer";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}
export enum GENDER {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

@Entity()
@Unique(["email"])
export class User {
  @PrimaryGeneratedColumn()
  id!:number;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Exclude()
  @Column()

  password!: string;

  @Column({ type: "enum", enum: GENDER })
  gender!: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
  
  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];
}
