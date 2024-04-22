import { Router } from "express";
import { AuthController } from "../../controllers/auth/AuthController";
import { EncryptionService } from "../../services/EncryptionService";

const route = Router();

const encryptionService = new EncryptionService();

const authController = new AuthController(encryptionService);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
route.post("/auth/register", authController.register);

export default route;
