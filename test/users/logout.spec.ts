import supertest from "supertest";
import app from "../../src/app";
import { db } from "../../src/utils/db";
import User, { UserType } from "../../src/models/user.model";
import RefreshToken from "../../src/models/refresh.token.model";
import bcrypt from "bcrypt";
import { UserRepository } from "../../src/repositories/UserRepository";
import { RefreshTokenRepository } from "../../src/repositories/RefreshTokenRepository";
import jwt from "jsonwebtoken";
import { TokenService } from "../../src/services/TokenService";
import { Config } from "../../src/config";
import { makeTokenService } from "../../src/factories/services/token-service-factory";
import { makeUserService } from "../../src/factories/services/user-service-factory";
import { JwtPayload } from "../../src/interfaces/jwt/JWTGenerator";
import exp from "constants";
const api = supertest(app);

const BASE_URL = "/auth/logout";
const userRepository = new UserRepository();
const refreshTokenRepository = new RefreshTokenRepository();

const tokenService = makeTokenService();

describe("POST /auth/logout", () => {
    beforeAll(async () => {
        await db.connect();
    });

    beforeEach(async () => {
        // delete all users created
        await User.deleteMany({});
        await RefreshToken.deleteMany({});
    });

    afterAll(async () => {
        // disconnect db
        await db.disconnect();
    });

    describe("happy path", () => {
        it("should return status json response", async () => {
            await api.post(BASE_URL).expect("Content-Type", /json/);
        });

        it.todo(
            "should delete refreshToken reference of the current user from the database",
        );
    });

    describe("unhappy path", () => {
        it("should return 401 unauthorized , in case an token is not supplied", async () => {
            //send refresh token
            await api.post(BASE_URL).expect(401);
        });
    });
});

async function createRefreshToken(user: string, jwtPayload: JwtPayload) {
    const newRefreshToken = await tokenService.persistRefreshToken(user);

    console.log("new refresh token", newRefreshToken);

    const refreshToken = tokenService.generateRefreshToken(
        {
            jwtPayload,
            refreshTokenId: newRefreshToken,
        },
        newRefreshToken._id.toString(),
    );

    return refreshToken;
}
