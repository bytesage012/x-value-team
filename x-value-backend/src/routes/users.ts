import { Router } from "express";
import { getUserById } from "../services/userService";

const router = Router();

// Public endpoint to fetch minimal user info (id, name)
router.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const user = getUserById(id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  return res.status(200).json({ user: { id: user.id, name: user.name } });
});

export default router;
