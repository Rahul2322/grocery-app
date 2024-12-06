import { Request } from "express";

export interface ApiResponse<T> {
  error: boolean;
  status: number;
  message?: string;
  data?: T;
  errors?: any;
  token?: string;
}


