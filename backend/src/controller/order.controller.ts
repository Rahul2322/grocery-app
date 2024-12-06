import { Request, Response } from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  orderCancel,
} from "../service/order.service";
import { UserRequest } from "../types/user-requesttypes.";

export const placeOrder = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }
  const orderData = req.body;
  const response = await createOrder(userId!, orderData);
  res.status(response.status).json(response);
  return;
};

export const getOrders = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }
  const response = await getAllOrders(userId!);
  res.status(response.status).json(response);
  return;
};

export const getUserOrder = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }
  const response = await getUserOrders(userId!);
  res.status(response.status).json(response);
  return;
};

export const cancelOrder = async(req:UserRequest,res:Response)=>{
    const user = req.user;
    const orderId = parseInt(req.params.orderId);
    if (!user?.id) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }
    const response = await orderCancel(user,orderId);
    res.status(response.status).json(response);
    return;

}
