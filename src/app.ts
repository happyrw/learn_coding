import express from "express";
import userRoutes from "./routes/user.ts";
import { NotFoundError } from "./errors/index.ts";
import { errorHandler } from "./middleware/errorHandler.ts";

const app = express();

app.use(express.json());

// All routes go here
app.use("/api/users", userRoutes);

// 404 handler — must be after all routes
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.path}`));
});

// Error handler — must be last, with 4 parameters
app.use(errorHandler);

export default app;
