import { Router } from "express";

const routes = Router();

const users = [
  { id: 1, name: "Alice", email: "alice@example.com", password: "password1" },
  { id: 2, name: "Bob", email: "bob@example.com", password: "password2" },
  {
    id: 3,
    name: "Charlie",
    email: "charlie@example.com",
    password: "password3",
  },
  { id: 4, name: "David", email: "david@example.com", password: "password4" },
];

// Get all users
routes.get("/", (req, res) => {
  res.json(users);
});

// Get single user by id
routes.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(user);
});

// Add new user
routes.post("/", (req, res) => {
  const body = req.body;
  const newUser = {
    id: users.length + 1,
    name: body.name,
    email: body.email,
    password: body.password,
  };
  users.push(newUser);
  res.status(201).json({ users });
});

// Update user by id
routes.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  const user = users.find((u) => u.id === id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  user.name = body.name || user.name;
  user.email = body.email || user.email;
  user.password = body.password || user.password;

  res.json(user);
});

// Delete user by id
routes.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  users.splice(userIndex, 1);
  res.json({ message: "User deleted", users });
});

export default routes;
