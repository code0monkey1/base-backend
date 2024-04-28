import { Router } from "express";
import { makeAuthController } from "../../factory/controllers/auth/auth-controller-factory";

const route = Router();

const authController = makeAuthController();

// eslint-disable-next-line @typescript-eslint/no-misused-promises
route.post("/register", authController.register);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
route.post("/login", authController.login);

export default route;
