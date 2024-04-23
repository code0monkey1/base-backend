import { Response } from "express";
import { JWTGenerator, JwtPayload } from "../interfaces/jwt/JWTGenerator";

export class CookieService {
    constructor(private readonly jwtService: JWTGenerator) {}

    setAccessToken(res: Response, jwtPayload: JwtPayload) {
        const token = this.jwtService.generate(jwtPayload);

        // return the jwt in the cookie
        res.cookie("accessToken", token, {
            domain: "localhost",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
            httpOnly: true, // this ensures that the cookie can be only taken by server
        });
    }

    setRefreshToken(res: Response, userId: string) {
        const token = this.jwtService.generate({ userId });

        // return the jwt in the cookie
        res.cookie("accessToken", token, {
            domain: "localhost",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
            httpOnly: true, // this ensures that the cookie can be only taken by server
        });
    }
}
