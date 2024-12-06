import { AppDataSource } from "../config/database";
import client from "../config/redis";
import { Product } from "../entity/product.entity";
import { User, UserRole } from "../entity/user.entity";
import { ApiResponse } from "../types/apiresponse.types";
import { HttpStatus } from "../utils/http-status.util";

export const createProduct = async (
  adminId: number,
  productData: any
): Promise<ApiResponse<Product>> => {
  const userRepository = AppDataSource.getRepository(User);
  const productRepository = AppDataSource.getRepository(Product); 

  const adminUser = await userRepository.findOne({ where: { id: adminId } });
  if (!adminUser || adminUser.role !== UserRole.ADMIN) {
    return {
      error: true,
      status: HttpStatus.FORBIDDEN,
      message: "You must be an admin to add a product",
    };
  }
  const product = new Product();
  product.name = productData.name;
  product.price = productData.price;
  product.stock = productData.stock;
  product.image = productData.image;
  try {
    const savedProduct = await productRepository.save(product);
    return { error: false, status: HttpStatus.CREATED, data: savedProduct };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Error creating product",
    };
  }
};

export const getSingleProduct = async (id:number): Promise<ApiResponse<Product>> => {
    const productRepository = AppDataSource.getRepository(Product);
    try {
    const product = await productRepository.findOne({
        where:{id}
    });
    if(!product){
        return {
            error: true,
            status: HttpStatus.NOT_FOUND,
            message: "No such product",
          };
    }
    return { error: false, status: HttpStatus.OK, data: product };
    } catch (error) {
        return {
            error: true,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: "Error fetching product",
          };
    }

}
export const getAllProducts = async (): Promise<ApiResponse<Product[]>> => {
  const productRepository = AppDataSource.getRepository(Product);
  try {
    console.log("prdododdoddodoo");
    
    const cachedProducts = await client.get("products");
    if (cachedProducts) {
      return {
        error: false,
        status: HttpStatus.OK,
        data: JSON.parse(cachedProducts),
      };
    }
    const products = await productRepository.find();
    await client.set('products',JSON.stringify(products),{
        EX:3600
    })
    return { error: false, status: HttpStatus.OK, data: products };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching products",
    };
  }
};

export const updateProduct = async (
  adminId: number,
  productId: number,
  updateData: any
): Promise<ApiResponse<Product>> => {
  const userRepository = AppDataSource.getRepository(User);
  const productRepository = AppDataSource.getRepository(Product);
  const adminUser = await userRepository.findOne({ where: { id: adminId } });
  if (!adminUser || adminUser.role !== UserRole.ADMIN) {
    return {
      error: true,
      status: HttpStatus.FORBIDDEN,
      message: "You must be an admin to update a product",
    };
  }
  const product = await productRepository.findOne({ where: { id: productId } });
  if (!product) {
    return {
      error: true,
      status: HttpStatus.NOT_FOUND,
      message: "Product not found",
    };
  }
  product.name = updateData.name || product.name;
  product.price = updateData.price || product.price;
  product.stock = updateData.stock || product.stock;
  product.image = updateData.image || product.image;
  try {
    const updatedProduct = await productRepository.save(product);
    return { error: false, status: HttpStatus.OK, data: updatedProduct };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Error updating product",
    };
  }
};

export const deleteProduct = async (
  adminId: number,
  productId: number
): Promise<ApiResponse<null>> => {
  const userRepository = AppDataSource.getRepository(User);
  const productRepository = AppDataSource.getRepository(Product);
  const adminUser = await userRepository.findOne({ where: { id: adminId } });
  if (!adminUser || adminUser.role !== UserRole.ADMIN) {
    return {
      error: true,
      status: HttpStatus.FORBIDDEN,
      message: "You must be an admin to delete a product",
    };
  }
  const product = await productRepository.findOne({ where: { id: productId } });
  if (!product) {
    return {
      error: true,
      status: HttpStatus.NOT_FOUND,
      message: "Product not found",
    };
  }
  try {
    await productRepository.remove(product);
    return { error: false, status: HttpStatus.OK, data: null };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Error deleting product",
    };
  }
};
