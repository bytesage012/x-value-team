import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { AuthTokenPayload, User } from "../types";
import { getUserById } from "../services/userService";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      token?: string;
    }
  }
}

const AUTH_HEADER_PREFIX = "bearer ";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.toLowerCase().startsWith(AUTH_HEADER_PREFIX)) {
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }

  const token = header.slice(AUTH_HEADER_PREFIX.length).trim();

  try {
    const payload = jwt.verify(token, config.jwtSecret) as AuthTokenPayload;
    const user = getUserById(payload.userId);

    if (!user) {
      return res.status(401).json({ message: "User associated with token no longer exists" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export {};
