import bcrypt from "bcryptjs";
import { ConflictError } from "../errors/index.ts";
import prisma from "../lib/prisma.ts";
import { asyncHandler } from "../middleware/asyncHandler.ts";
import { signToken } from "../utils/jwt.ts";

export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ConflictError("Email already in use");
  }

  // Hash password
  const hashed = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
    },
  });

  // Create token
  const token = signToken({ userId: user.id, email: user.email });
  res.status(201).json({ token });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    throw new ConflictError("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ConflictError("Invalid credentials");
  }

  const token = signToken({ userId: user.id, email: user.email });
  res.json({ token });
});

export const authUser = asyncHandler(async (req, res) => {
  const { userId, email } = req.user!;

  const user = await prisma.user.findUnique({
    where: { id: userId, email },
  });

  const { password, ...userWithoutPassword } = user!;

  res.json({ user: userWithoutPassword });
});

export const update = asyncHandler(async (req, res) => {
  const { userId, email } = req.user!;
  const { name, email: newEmail, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: userId, email },
  });
  if (!user) {
    throw new ConflictError("User not found");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: name || user.name,
      email: newEmail || user.email,
      password: password ? await bcrypt.hash(password, 10) : user.password,
    },
  });

  res.json({ message: "User updated successfully" });
});
