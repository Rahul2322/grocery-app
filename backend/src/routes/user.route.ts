import { Router } from "express";
import {
  addUser,
  deleteUser,
  getAllUser,
  getUser,
  loginUser,
  update,
} from "../controller/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const route = Router();
route.post("/", addUser);
route.post("/login", loginUser);
route.get("/", authMiddleware, getAllUser);
route.get("/:id", authMiddleware, getUser);
route.put("/", authMiddleware, update);
route.delete("/", authMiddleware, deleteUser);
export default route;
