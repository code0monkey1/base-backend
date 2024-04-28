/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { makeAuthController } from "../../factories/controllers/auth/auth-controller-factory";

import registerValidator from "../../validators/register-validator";

const route = Router();

const authController = makeAuthController();

route.post("/register", registerValidator, authController.register);

route.post("/login", authController.login);

export default route;
