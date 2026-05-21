import { Router } from "express";
import { authUser, login, register } from "../controllers/auth.controller.ts";
import { authenticate } from "../middleware/auth.middleware.ts";

const AuthRoutes = Router();

AuthRoutes.post("/register", register);
AuthRoutes.post("/login", login);

AuthRoutes.get("/me", authenticate, authUser);

export default AuthRoutes;
