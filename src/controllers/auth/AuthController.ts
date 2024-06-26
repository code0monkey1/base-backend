import { NextFunction, Request, Response } from "express";
import User from "../../models/user.model";
import createHttpError from "http-errors";
import { TokenService } from "../../services/TokenService";
import { UserService } from "../../services/UserService";
import { validationResult } from "express-validator";
export class AuthController {
    constructor(
        private readonly tokenService: TokenService,
        private readonly userService: UserService,
    ) {}
    signup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password } = req.body as Request & {
                name: string;
                email: string;
                password: string;
            };

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
            this.tokenService.setAccessToken(res, {
                userId: newUser._id.toString(),
            });

            // set refresh cookie
            await this.tokenService.setRefreshToken(
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
            const { email, password } = req.body as Request & {
                email: string;
                password: string;
            };

            const result = validationResult(req);

            if (!result.isEmpty()) {
                return res.status(400).json({ errors: result.array() });
            }

            const user = await this.userService.findByEmailAndPassword(
                email,
                password,
            );

            // set access cookie
            this.tokenService.setAccessToken(res, {
                userId: user?._id.toString(),
            });

            // set refresh cookie

            await this.tokenService.setRefreshToken(
                res,
                { userId: user?._id.toString() },
                user?._id.toString(),
            );

            res.status(201).json();
        } catch (e) {
            next(e);
        }
    };

    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { refreshTokenId, userId } = (req as AuthRequest).auth;

            await this.tokenService.deleteRefreshTokenOfUser(
                refreshTokenId,
                userId,
            );

            //remove refreshToken and accessToken from response cookies
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");

            res.end();
        } catch (e) {
            next(e);
        }
    };
}

export interface AuthRequest extends Request {
    auth: {
        userId: string;
        refreshTokenId: string;
    };
}

export interface RegisterRequest extends Request {
    body: UserData;
}

export interface LoginRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

export interface UserData {
    name: string;
    email: string;
    password: string;
}
