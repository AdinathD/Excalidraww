import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt, { JwtPayload } from "jsonwebtoken";

export function middleware(req: Request, res: Response, next: NextFunction) {
  //@ts-ignore
  const token = req.headers["authorization"] ?? "";

  try {

    const decoded = jwt.verify(token, JWT_SECRET);

    if(decoded){
      //@ts-ignore
      req.userId = (decoded as JwtPayload).userId;

    next();
  }
    
  } catch {
    //@ts-ignore
    return res.status(403).json({ message: "Unauthorized" });
  }
}
