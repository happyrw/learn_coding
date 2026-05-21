import { Router } from "express";
import { authUser, login, register } from "../controllers/auth.controller.ts";
import { authenticate } from "../middleware/auth.middleware.ts";
import { validate } from "../middleware/validate.ts";
import { loginSchema, registerSchema } from "../schema/user.schema.ts";

const AuthRoutes = Router();

AuthRoutes.post("/register", validate(registerSchema), register);
AuthRoutes.post("/login", validate(loginSchema), login);

AuthRoutes.get("/me", authenticate, authUser);

export default AuthRoutes;
