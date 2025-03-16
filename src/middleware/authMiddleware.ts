import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/authService";
import type { role } from "@prisma/client";
export async function protect(req: Request, res: Response, next: NextFunction) {
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res
      .status(401)
      .json({ message: "You are not logged in! Please log in to get access" });
  }
  try {
    const userInfo = await authService.getUserFromToken(token);
    if (!userInfo) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    req.body.user = userInfo;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "JWT_SECRET is not defined") {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  next();
}

export function checkAdmin(req: Request, res: Response, next: NextFunction) {
  if (
    req.body.user &&
    req.body.user.roles.map((role: role) => role.name).includes("ROLE_ADMIN")
  ) {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }
  next();
}
