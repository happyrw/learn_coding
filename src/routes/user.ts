import { Router } from "express";
import prisma from "../lib/prisma.ts";
import { BadRequestError, NotFoundError } from "../errors/index.ts";
import { asyncHandler } from "../middleware/asyncHandler.ts";
// import prisma from "../lib/prisma.ts";

const routes = Router();

type IdType = any;

// Get all users
routes.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.status(200).json({ users, message: "Users retrieved successfully" });
});

// Get single user by id
routes.get("/:id", async (req, res) => {
  const id: IdType = req.params.id;

  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new NotFoundError("User");
  }
  res.json(user);
});

// Add new user
routes.post("/", async (req, res) => {
  const { name, email } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new BadRequestError("Email already exists");
  }

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
    },
  });

  res.json({ user: newUser, message: "User created successfully" });
});

// Update user by id
routes.put("/:id", async (req, res) => {
  const id: IdType = req.params.id;
  const body = req.body;
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) {
    throw new NotFoundError("User");
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      name: body.name || user.name,
      email: body.email || user.email,
    },
  });

  res.json(updatedUser);
});

// Delete user by id
routes.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const id: IdType = req.params.id;
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundError("User");
    }

    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: "User deleted" });
  }),
);

export default routes;
