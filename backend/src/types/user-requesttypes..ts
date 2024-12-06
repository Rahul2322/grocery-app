import { Request } from "express";

export interface UserRequest extends Request {
    user?: UserPayload;
  }
  export interface UserPayload {
    id: number;
    role: string;
  }