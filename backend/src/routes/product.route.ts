import { Router } from "express";
import {
  addProduct,
  editProduct,
  listProducts,
  removeProduct,
  singleProduct,
} from "../controller/product.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const router = Router();
router.post("/",authMiddleware, addProduct);
router.get("/", listProducts);
router.get("/:id",authMiddleware,singleProduct);
router.put("/:id", authMiddleware,editProduct);
router.delete("/:id",authMiddleware, removeProduct);
export default router;
