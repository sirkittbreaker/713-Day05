import * as authService from "../services/authService";
import express from "express";
import type { role } from "@prisma/client";
const router = express.Router();
router.post("/authenticate", async (req, res) => {
  const { username, password } = req.body;
  const user = await authService.findByUsername(username);
  if (!user) {
    return res.status(401).json({ messege: "User doesn't exist" });
  }
  if (
    password === undefined ||
    user.password === undefined ||
    user.password === null
  ) {
    return res.status(400).json({ messege: "Password is required" });
  }
  const isPasswordCorrect = await authService.comparePassword(
    password,
    user.password
  );
  if (!isPasswordCorrect) {
    return res.status(401).json({ messege: "Invalid credentials" });
  }
  const token = authService.generatetoken(user.id);
  res.status(200).json({
    status: "success",
    access_token: token,
    user: {
      id: user.id,
      // username: user.username,
      username: user.organizer?.name || "unknown",
      roles: user.roles.map((role: role) => role.name),
    },
  });
});

export default router;
