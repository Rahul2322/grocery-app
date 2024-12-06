import { AppDataSource } from "../config/database";
import { User, UserRole } from "../entity/user.entity";
import { Product } from "../entity/product.entity";
import { Order, OrderStatus } from "../entity/order.entity";
import { OrderItem } from "../entity/orderItem.entity";
import { ApiResponse } from "../types/apiresponse.types";
import { HttpStatus } from "../utils/http-status.util";
import { error } from "console";
import { UserPayload } from "../types/user-requesttypes.";
import client from "../config/redis";

export const createOrder = async (
  userId: number,
  orderData: any
): Promise<ApiResponse<Order>> => {
  try {
    const result = await AppDataSource.transaction(
      async (transactionManager) => {
        const userRepository = transactionManager.getRepository(User);
        const productRepository = transactionManager.getRepository(Product);

        const user = await userRepository.findOne({ where: { id: userId } });
        if (!user) {
          throw {
            error: true,
            status: HttpStatus.NOT_FOUND,
            message: "User not found",
          };
        }

        const orderItems = [];
        let totalAmount = 0;

        for (let item of orderData.orderItems) {
          const product = await productRepository.findOne({
            where: { id: item.productId },
          });

          if (!product || product.stock < item.quantity) {
            throw {
              error: true,
              status: HttpStatus.BAD_REQUEST,
              message: `Product ${
                product ? product.name : item.productId
              } is out of stock or not found`,
            };
          }

          totalAmount += product.price * item.quantity;

          product.stock -= item.quantity;
          await transactionManager.save(product);

          orderItems.push({
            product,
            quantity: item.quantity,
            price: product.price,
          });
        }

        const order = new Order();
        order.user = user;
        order.address = orderData.address;
        order.totalAmount = totalAmount;
        order.orderStatus = OrderStatus.PROCESSING;

        const savedOrder = await transactionManager.save(order);

        for (let item of orderItems) {
          const orderItem = new OrderItem();
          orderItem.order = savedOrder;
          orderItem.product = item.product;
          orderItem.quantity = item.quantity;
          orderItem.price = item.price;
          orderItem.totalPrice = item.price * item.quantity;
          await transactionManager.save(orderItem);
        }

        return {
          error: false,
          status: HttpStatus.CREATED,
          data: savedOrder,
        };
      }
    );

    return result;
  } catch (error) {
    console.error(error);
    return {
      error: true,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Error creating order",
    };
  }
};

export const getAllOrders = async (
  adminId: number
): Promise<ApiResponse<Order[]>> => {
  const userRepository = AppDataSource.getRepository(User);
  const orderRepository = AppDataSource.getRepository(Order);
  const adminUser = await userRepository.findOne({ where: { id: adminId } });
  const cachedOrders = await client.get("orders");
    if (cachedOrders) {
      return {
        error: false,
        status: HttpStatus.OK,
        data: JSON.parse(cachedOrders),
      };
    }
  if (!adminUser || adminUser.role !== UserRole.ADMIN) {
    return {
      error: true,
      status: HttpStatus.FORBIDDEN,
      message: "You must be an admin to view all orders",
    };
  }
  try {
    const orders = await orderRepository.find({
      relations: ["user", "orderItems"],
    });
    await client.set('orders',JSON.stringify(orders),{
        EX:3600
    })
    return { error: false, status: HttpStatus.OK, data: orders };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching orders",
    };
  }
};

export const getUserOrders = async (
  userId: number
): Promise<ApiResponse<Order[]>> => {
  const orderRepository = AppDataSource.getRepository(Order);
  const orders = await orderRepository.find({
    where: { user: { id: userId } },
    relations: ["orderItems", "orderItems.product"],
    order: { createdAt: "DESC" },
  });
  if (!orders || orders.length === 0) {
    return {
      error: true,
      status: HttpStatus.NOT_FOUND,
      message: "No orders found for this user.",
    };
  }
  return { error: false, status: HttpStatus.OK, data: orders };
};

export const orderCancel = async (user: UserPayload, orderId: number) => {
  const orderRepository = AppDataSource.getRepository(Order);
  const order = await orderRepository.findOne({
    where: { id: orderId },
    relations: ["user"],
  });
  if (!order) {
    return {
      error: true,
      status: HttpStatus.NOT_FOUND,
      message: "Order not found",
    };
  }

  if (order.orderStatus !== OrderStatus.PROCESSING) {
    return {
      status: HttpStatus.BAD_REQUEST,
      message: "Only orders in 'PROCESSING' state can be cancelled",
    };
  }

  if (order.user.id !== user.id && user.role !== UserRole.ADMIN) {
    return {
      status: HttpStatus.FORBIDDEN,
      message: "You are not authorized to cancel this order",
    };
  }

  order.orderStatus = OrderStatus.CANCELLED;

  try {
    const cancelledOrder = await orderRepository.save(order);
    return {
      status: HttpStatus.OK,
      message: "Order successfully cancelled",
      data: cancelledOrder,
    };
  } catch (error) {
    console.error(error);
    return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Error cancelling order",
        
      };
  }
};
