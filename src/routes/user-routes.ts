import { Router } from "express";
import { UserController } from "../controllers/user/UserController";
import authenticate from "../middleware/authenticate";
import { makeUserService } from "../factories/services/user-service-factory";

const route = Router();
const userService = makeUserService();
const userController = new UserController(userService);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
route.patch("/:userId", authenticate, userController.updateById);

export default route;
