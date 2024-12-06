import { Request, Response } from "express";
import {
  createUser,
  getUserById,
  getUsers,
  login,
  removeUser,
  updateUser,
} from "../service/user.service";
import { UserRequest } from "../types/user-requesttypes.";
import { UserRole } from "../entity/user.entity";
import { HttpStatus } from "../utils/http-status.util";

export const addUser = async (req: Request, res: Response) => {
  const user = await createUser(req.body);
  res.status(user.status).json(user);
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      message: "Email and password are required",
    });
  }
  const user = await login(email, password);
  res.cookie("token", user.token, {
    httpOnly: true,
  });
  res.status(user.status).json(user);
};
export const getAllUser = async (req: UserRequest, res: Response) => {
  const userRole = req.user?.role;  
  if(userRole !== UserRole.ADMIN){
     res.status(HttpStatus.FORBIDDEN).json({
        message:"You are not authorized"
    })
    return;
  }
  const users = await getUsers();
  res.status(users.status).json(users.data);
};
export const getUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id, 10);
  console.log(userId,"userereksjfshflsjfslfjl");
  
  if (isNaN(userId)) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }
  const user = await getUserById(userId);
  if (user.error) {
    res.status(user.status).json(user.message);
    return;
  }
  res.status(user.status).json(user.data);
  return;
};
export const deleteUser = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }
  const user = await removeUser(userId!);
  res.status(user.status).json(user);
  return;
};
export const update = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  console.log(userId);
  
  if (!userId) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }
  const user = await updateUser(req.body, userId!);
  res.status(user.status).json(user);
  return;
};
