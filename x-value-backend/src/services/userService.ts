import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { database } from "../data/database";
import { LoginInput, SignupInput, User } from "../types";
import { hashPassword, verifyPassword } from "../utils/password";
import { config } from "../config/env";

export const createUser = async (input: SignupInput) => {
  const existing = database.findUserByEmail(input.email);

  if (existing) {
    throw new Error("Email is already registered");
  }

  const passwordHash = await hashPassword(input.password);
  const now = new Date().toISOString();

  const user: User = {
    id: uuid(),
    email: input.email.toLowerCase(),
    name: input.name,
    passwordHash,
    isVerified: false,
    createdAt: now,
  };

  await database.addUser(user);
  return user;
};

export const verifyCredentials = async ({ email, password }: LoginInput) => {
  const user = database.findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await verifyPassword(password, user.passwordHash);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  return user;
};

export const issueToken = (user: User) =>
  jwt.sign(
    {
      userId: user.id,
      email: user.email,
      isVerified: user.isVerified,
    },
    config.jwtSecret,
    { expiresIn: "2h" },
  );

export const getUserById = (id: string) => database.findUserById(id);
