import { DataSource } from "typeorm";
import { getConfigKey } from "./locals";
import { User } from "../entity/user.entity";
import { Product } from "../entity/product.entity";
import { Order } from "../entity/order.entity";
import { OrderItem } from "../entity/orderItem.entity";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: getConfigKey("dbHost"),
  port: Number(getConfigKey("dbPort")),
  username: getConfigKey("dbUserName"),
  password: getConfigKey("dbPassword"),
  database: getConfigKey("dbName"),
//   entities: ["src/*/.entity{.ts,.js}"],
  entities: [User,Product,Order,OrderItem],
  synchronize: true,
});
