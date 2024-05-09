import { NextFunction, Request, Response } from "express";
import User from "../../models/user.model";
import createHttpError from "http-errors";
import { TokenService } from "../../services/TokenService";
import { UserService } from "../../services/UserService";
import { validationResult } from "express-validator";
export class AuthController {
    constructor(
        private readonly cookieService: TokenService,
        private readonly userService: UserService,
    ) {}
    signup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password } = req.body as AuthRequest;

            const result = validationResult(req);

            if (!result.isEmpty()) {
                return res.status(400).json({ errors: result.array() });
            }

            const user = await User.findOne({ email });

            if (user) {
                const error = createHttpError(400, "User already exists");
                throw error;
            }

            // create a new user
            const newUser = await this.userService.createUser(
                name,
                email,
                password,
            );

            // set access cookie
            this.cookieService.setAccessToken(res, {
                userId: newUser._id.toString(),
            });

            // set refresh cookie
            await this.cookieService.setRefreshToken(
                res,
                { userId: newUser._id.toString() },
                newUser._id.toString(),
            );

            res.status(201).json({ user: newUser });
        } catch (e) {
            next(e);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        // set cookies

        try {
            const { name, email, password } = req.body as AuthRequest;

            if (!name || !email || !password) {
                const error = createHttpError(400, "Validation Error");
                throw error;
            }

            const user = await this.userService.findByEmailAndPassword(
                email,
                password,
            );

            // set access cookie
            this.cookieService.setAccessToken(res, {
                userId: user?._id.toString(),
            });

            // set refresh cookie

            await this.cookieService.setRefreshToken(
                res,
                { userId: user?._id.toString() },
                user?._id.toString(),
            );

            res.status(201).json();
        } catch (e) {
            next(e);
        }
    };

    logout = (req: Request, res: Response) => {
        // clear cookies
        res.status(201).json();
    };
}

export interface AuthRequest {
    name: string;
    email: string;
    password: string;
}
