import { Router } from "express";
import { AuthController } from "../../controllers/auth/AuthController";

const route = Router();

const authController = new AuthController();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
route.post("/auth/register", authController.register);

export default route;
