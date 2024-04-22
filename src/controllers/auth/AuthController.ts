import { NextFunction, Request, Response } from "express";
import User from "../../models/user.model";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Config } from "../../config";
export class AuthController {
    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password } = req.body as AuthRequest;

            if (!name || !email || !password) {
                const error = createHttpError(400, "No body provided");
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
                hashedPassword: await bcrypt.hash(password, 10),
            });

            // create a token
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            const token = jwt.sign({ userId: newUser._id }, Config.JWT_SECRET!);

            // return the jwt in the cookie
            res.cookie("authToken", token, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, // 1 hour
                httpOnly: true, // this ensures that the cookie can be only taken by server
            });

            res.cookie("refreshToken", token, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
                httpOnly: true, // this ensures that the cookie can be only taken by server
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
