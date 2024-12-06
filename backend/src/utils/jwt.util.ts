import jwt from "jsonwebtoken";
import { getConfigKey } from "../config/locals";
const JWT_SECRET = getConfigKey('jwtSecretKey');
const JWT_EXPIRY = getConfigKey('jwtExpiryTime');

export const generateToken = (id: number, role: string): string => {
  const payload = { id, role };
  console.log(payload,'payload');
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
