/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { makeAuthController } from "../../factories/controllers/auth/auth-controller-factory";

import registerValidator from "../../validators/register-validator";
import loginValidator from "../../validators/login-validator";

const route = Router();

const authController = makeAuthController();

route.post("/signup", registerValidator, authController.signup);

route.post("/login", loginValidator, authController.login);

export default route;
