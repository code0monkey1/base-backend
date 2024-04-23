import { Router } from "express";
import { AuthController } from "../../controllers/auth/AuthController";
import { BcryptService } from "../../services/BcryptService";
import { JWTService } from "../../services/JwtService";
import { Config } from "../../config";
import { CookieService } from "../../services/CookieService";

const route = Router();

const encryptionService = new BcryptService();
const jwtService = new JWTService(Config.JWT_SECRET!);

const cookieService = new CookieService(jwtService);
const authController = new AuthController(encryptionService, cookieService);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
route.post("/register", authController.register);

export default route;
