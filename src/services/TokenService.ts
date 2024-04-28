import { Response } from "express";
import { JWTGenerator, JwtPayload } from "../interfaces/jwt/JWTGenerator";
import RefreshToken from "../models/refresh.token.model";

export class TokenService {
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

    async setRefreshToken(res: Response, jwtPayload: JwtPayload, user: string) {
        //persist jwt  , should have user and expiry time

        const savedRefreshToken = await this.persistRefreshToken(user);

        const refreshToken = this.generateRefreshToken(
            jwtPayload,
            savedRefreshToken._id.toString(),
        );

        // return the jwt in the cookie
        res.cookie("refreshToken", refreshToken, {
            domain: "localhost",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
            httpOnly: true, // this ensures that the cookie can be only taken by server
        });
    }

    generateRefreshToken(jwtPayload: JwtPayload, refreshTokenId: string) {
        const token = this.jwtService.generate(jwtPayload, {
            expiresIn: "1y",
            jwtId: refreshTokenId,
            issuer: "base-backend",
        });

        return token;
    }

    async persistRefreshToken(user: string, years_to_persist = 1) {
        //persist jwt  , should have user and expiry time
        const YEARS = 60 * 60 * 24 * 365 * years_to_persist;

        //persist
        const refreshToken = await RefreshToken.create({
            user,
            expiresAt: new Date(Date.now() + YEARS),
        });

        return refreshToken;
    }
}