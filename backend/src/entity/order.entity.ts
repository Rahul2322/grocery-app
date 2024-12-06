import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { OrderItem } from "./orderItem.entity";
export enum OrderStatus {
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}
@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;
  
  @Column()
  address!: string;

  @Column()
  totalAmount!: number;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PROCESSING })
  orderStatus!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user!: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems!: OrderItem[];
}
