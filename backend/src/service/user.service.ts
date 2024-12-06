import { plainToClass } from "class-transformer";
import { CreateUserDto, UpdateUserDto } from "../dto/user.dto";
import { validate } from "class-validator";
import { AppDataSource } from "../config/database";
import { User, UserRole } from "../entity/user.entity";
import * as bcrypt from "bcryptjs";
import { ApiResponse } from "../types/apiresponse.types";
import { HttpStatus } from "../utils/http-status.util";
import { generateToken } from "../utils/jwt.util";
import client from "../config/redis";

export const createUser = async (
  createUserDto: CreateUserDto
): Promise<ApiResponse<User>> => {
  const userDto = plainToClass(CreateUserDto, createUserDto);
  const errors = await validate(userDto);
  if (errors.length > 0) {
    return {
      error: true,
      status: HttpStatus.BAD_REQUEST,
      message: "Validation failed",
      errors: errors,
    };
  }
  const userRepository = AppDataSource.getRepository(User);
  const user = new User();
  user.username = userDto.username;
  user.email = userDto.email;
  user.password = await hashPassword(userDto.password);
  user.role = userDto.role || UserRole.USER;
  user.gender = userDto.gender;

  try {
    const savedUser = await userRepository.save(user);
    return { error: false, status: HttpStatus.CREATED, data: savedUser };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Error saving user",
    };
  }
};

export const login = async (
  email: string,
  password: string
): Promise<ApiResponse<User>> => {
  const userRepository = AppDataSource.getRepository(User);
  try {
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return {
        error: true,
        status: HttpStatus.NOT_FOUND,
        message: "Invalid credentials",
      };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        error: true,
        status: HttpStatus.BAD_REQUEST,
        message: "Invalid credentials",
      };
    }
    const token = generateToken(user.id, user.role);
    return { error: false, status: HttpStatus.OK, data: user, token };
  } catch (error) {
    console.error(error);
    return {
      error: false,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Error during login",
    };
  }
};

export const getUsers = async (): Promise<ApiResponse<User[]>> => {
  const userRepository = AppDataSource.getRepository(User);
  try {
    const cachedUsers = await client.get("users");

    if (cachedUsers) {
      return {
        error: false,
        status: HttpStatus.OK,
        data: JSON.parse(cachedUsers),
      };
    }
    const users = await userRepository.find();
    if (users.length === 0) {
      return {
        error: true,
        status: HttpStatus.NOT_FOUND,
        message: "No users found",
      };
    }
    await client.set("users", JSON.stringify(users), {
      EX: 3600,
    });
    return { error: false, status: HttpStatus.OK, data: users };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching users",
    };
  }
};

export const getUserById = async (id: number) => {
  const userRepository = AppDataSource.getRepository(User);
  try {
    const user = await userRepository.findOne({ where: { id } });
    if (!user) {
      return {
        error: true,
        status: HttpStatus.NOT_FOUND,
        message: "User not found",
      };
    }
    return { error: false, status: HttpStatus.OK, data: user };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Error fetching user",
    };
  }
};

export const removeUser = async (userId: number) => {
  const userRepository = AppDataSource.getRepository(User);
  try {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return {
        error: true,
        status: HttpStatus.NOT_FOUND,
        message: "User not found",
      };
    }
    await userRepository.remove(user);
    return {
      error: false,
      status: HttpStatus.OK,
      message: "User deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Error deleting user",
    };
  }
};

export const updateUser = async (
  updateUserDto: UpdateUserDto,
  userId: number
): Promise<ApiResponse<User>> => {
  const userDto = plainToClass(CreateUserDto, updateUserDto);
  const errors = await validate(userDto);
  if (errors.length > 0) {
    return {
      error: true,
      status: HttpStatus.BAD_REQUEST,
      message: "Validation failed",
      errors: errors,
    };
  }
  const userRepository = AppDataSource.getRepository(User);
  try {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return {
        error: true,
        status: HttpStatus.NOT_FOUND,
        message: "User not found",
      };
    }
    user.username = userDto.username || user.username;
    user.email = userDto.email || user.email;
    user.password = (await hashPassword(userDto.password)) || user.password;
    user.gender = userDto.gender || user.gender;
    user.role = userDto.role || user.role;
    const updatedUser = await userRepository.save(user);
    return { error: false, status: HttpStatus.OK, data: updatedUser };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: "Error updating user",
    };
  }
};

const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};
