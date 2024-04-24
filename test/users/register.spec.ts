import supertest from "supertest";
import app from "../../src/app";
import bcrypt from "bcrypt";
const api = supertest(app);
import User from "../../src/models/user.model";
import { db } from "../../src/utils/db";
import { isJwt } from "../../src/utils";
const BASE_URL = "/auth/register";
describe("PORT /register", () => {
    beforeAll(async () => {
        await db.connect();
    });

    beforeEach(async () => {
        // delete all users created
        await User.deleteMany({});
    });
    afterAll(async () => {
        // disconnect db
        await db.disconnect();
    });
    it("should return 400 status code , when no body provided", async () => {
        await api.post(BASE_URL).expect(400);
    });

    it("should return valid json response", async () => {
        await api.post(BASE_URL).expect("Content-Type", /application\/json/);
    });

    it("should return 400 status if user already exists ", async () => {
        const user = {
            name: "test",
            email: "test@gmail.com",
            password: "test",
        };

        await User.create({
            name: user.name,
            email: user.email,
            hashedPassword: await bcrypt.hash(user.password, 10),
        });

        await api.post(BASE_URL).send(user).expect(400);
    });

    it("should return status 201,user should be created ", async () => {
        const user = {
            name: "test",
            email: "test@gmail.com",
            password: "test",
        };
        await api.post(BASE_URL).send(user).expect(201);
        const users = await User.find({});
        expect(users.length).toBe(1);
        expect(users[0].name).toBe(user.name);
        expect(users[0].email).toBe(user.email);
    });

    it("should store hashed password in the database", async () => {
        //arrange
        const user = {
            name: "test",
            email: "test@gmail.com",
            password: "test",
        };

        //act
        await api.post(BASE_URL).send(user).expect("Content-Type", /json/);

        const users = await User.find({});

        //assert
        expect(users).toHaveLength(1);

        //check user is the same

        expect(users[0].hashedPassword).toBeDefined();

        expect(
            await bcrypt.compare(user.password, users[0].hashedPassword),
        ).toBeTruthy();
    });

    it("should return accessToken and refreshToken  inside a cookie", async () => {
        //arrange
        const user = {
            name: "test",
            email: "test@gmail.com",
            password: "test",
        };

        //act
        const response = await api.post(BASE_URL).send(user).expect(201);

        interface Headers {
            ["set-cookie"]: string[];
        }

        let accessToken = "";
        let refreshToken = "";

        // assert
        expect(response.headers["set-cookie"]).toBeDefined();

        const cookies =
            (response.headers as unknown as Headers)["set-cookie"] || [];

        cookies.forEach((c) => {
            if (c.startsWith("accessToken="))
                accessToken = c.split(";")[0].split("=")[1];
            if (c.startsWith("refreshToken="))
                refreshToken = c.split(";")[0].split("=")[1];
        });

        expect(accessToken).toBeTruthy();
        expect(refreshToken).toBeTruthy();

        expect(isJwt(accessToken)).toBeTruthy();
        expect(isJwt(refreshToken)).toBeTruthy();
    });
});
