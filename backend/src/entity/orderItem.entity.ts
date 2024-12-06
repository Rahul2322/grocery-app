import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { Order } from "./order.entity";
@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantity!: number;

  @Column()
  price!: number;

  @Column()
  totalPrice!: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order!: Order;
  
  @ManyToOne(() => Product, (product) => product.orderItems)
  product!: Product;
}
