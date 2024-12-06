import { Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { UserPayload, UserRequest } from "../types/user-requesttypes.";
import { verifyToken } from "../utils/jwt.util";

export const authMiddleware = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  console.log(token,'token');
  
  if (!token) {
    res.status(401).json({ message: "You are not authorized" });
  }
  try {
    const decoded = verifyToken(token!);

    if (isValidPayload(decoded)) {
        console.log(decoded,'decodeedd');
        
      req.user = decoded;
    }
    console.log(decoded,'deco');
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
function isValidPayload(payload: JwtPayload | string): payload is UserPayload {
  
  return (
    typeof payload === "object" &&
    payload !== null &&
    "id" in payload &&
    "role" in payload
  );
}
