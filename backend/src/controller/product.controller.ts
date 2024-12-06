import { Request, Response } from "express";
import { UserRequest } from "../types/user-requesttypes.";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "../service/product.service";
export const addProduct = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  console.log(userId,"userId");
  
  if (!userId) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }
  const productData = req.body;
  
  const response = await createProduct(userId!, productData);
  res.status(response.status).json(response);
  return;
};

export const singleProduct = async(req: UserRequest, res: Response)=>{
  const productId = parseInt(req.params.id);
  if (!productId) {
    res.status(400).json({ message: "Invalid product ID" });
    return;
  }
  const response = await getSingleProduct(productId);
  res.status(response.status).json(response);
  return;
}
export const listProducts = async (req: Request, res: Response) => {
  const response = await getAllProducts();
  res.status(response.status).json(response);
  return;
};
export const editProduct = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }
  const productId = parseInt(req.params.id);
  const updateData = req.body;
  const response = await updateProduct(userId!, productId, updateData);
  res.status(response.status).json(response);
  return;
};
export const removeProduct = async (req: UserRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(400).json({ message: "Invalid user ID" });
    return;
  }
  const productId = parseInt(req.params.id);
  const response = await deleteProduct(userId!, productId);
  res.status(response.status).json(response);
  return;
};
