import { NextFunction } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt, { JwtPayload } from "jsonwebtoken";


export function middleware(req: Request, res: Response, next: NextFunction) {
  //@ts-ignore
  const token = req.headers["authorization"] ?? "";
  //@ts-ignore
  const decoded = jwt.verify(token, JWT_SECRET);


  try {
    //@ts-ignore

    const decoded = jwt.verify(token, JWT_SECRET);

    //@ts-ignore
    req.userId = (decoded as JwtPayload).userId;
    //@ts-ignore
    next();
  } catch {
    //@ts-ignore
    return res.status(403).json({ message: "Unauthorized" });
  }
}
