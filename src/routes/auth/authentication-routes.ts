import { Router } from "express";
import { AuthController } from "../../controllers/auth/AuthController";
import { EncryptionService } from "../../services/EncryptionService";
import { JWTService } from "../../services/JwtService";
import { Config } from "../../config";
import { TokenService } from "../../services/TokenService";
import { UserRepository } from "../../repositories/UserRepository";
import { UserService } from "../../services/UserService";

const route = Router();

const encryptionService = new EncryptionService();
const jwtService = new JWTService(Config.JWT_SECRET!);
const userRepository = new UserRepository();

const userService = new UserService(encryptionService, userRepository);

const cookieService = new TokenService(jwtService);
const authController = new AuthController(cookieService, userService);

// eslint-disable-next-line @typescript-eslint/no-misused-promises
route.post("/register", authController.register);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
route.post("/login", authController.login);

export default route;
