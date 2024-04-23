import { NextFunction, Request, Response } from "express";
import User from "../../models/user.model";
import createHttpError from "http-errors";
import { BcryptService } from "../../services/BcryptService";
import { CookieService } from "../../services/CookieService";

export class AuthController {
    constructor(
        private readonly encryptionService: BcryptService,
        private readonly cookieService: CookieService,
    ) {}
    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password } = req.body as AuthRequest;

            if (!name || !email || !password) {
                const error = createHttpError(400, "Validation Error");
                throw error;
            }

            const user = await User.findOne({ email });

            if (user) {
                const error = createHttpError(400, "User already exists");
                throw error;
            }

            // create a new user
            const newUser = await User.create({
                name,
                email,
                hashedPassword: await this.encryptionService.hash(password),
            });

            // set access cookie
            this.cookieService.setAccessToken(res, {
                userId: newUser._id.toString(),
            });

            res.status(201).json({ user: newUser });
        } catch (e) {
            next(e);
        }
    };

    signIn = (req: Request, res: Response) => {
        // set cookies

        res.status(201).json();
    };
    signOut = (req: Request, res: Response) => {
        // clear cookies
        res.status(201).json();
    };
}

export interface AuthRequest {
    name: string;
    email: string;
    password: string;
}
