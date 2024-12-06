import { Router } from "express";
import userRoutes from "./user.route";
import orderRoutes from "./order.route";
import productRoutes from "./product.route";
const route = Router();
route.use("/user", userRoutes);
route.use("/order", orderRoutes);
route.use("/product", productRoutes);
export default route;