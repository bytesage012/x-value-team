import { Router } from "express";
import { User } from "../types";
import { createUser, issueToken, verifyCredentials } from "../services/userService";
import { validateLogin, validateSignup } from "../utils/validation";

const router = Router();

const buildUserResponse = (user: User) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
});

router.post("/signup", async (req, res) => {
  try {
    const payload = validateSignup(req.body);
    const user = await createUser(payload);
    const token = issueToken(user);

    return res.status(201).json({
      user: buildUserResponse(user),
      token,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign up";
    const status = message.toLowerCase().includes("already") ? 409 : 400;

    return res.status(status).json({ message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const payload = validateLogin(req.body);
    const user = await verifyCredentials(payload);
    const token = issueToken(user);

    return res.status(200).json({
      user: buildUserResponse(user),
      token,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to log in";
    return res.status(401).json({ message });
  }
});

export default router;
