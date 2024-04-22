import supertest from "supertest";
import app from "../../src/app";
import bcrypt from "bcrypt";
const api = supertest(app);
import User from "../../src/models/user.model";
import { db } from "../../src/utils/db";

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
        await api.post("/auth/register").expect(400);
    });

    it("should return valid json response", async () => {
        await api
            .post("/auth/register")
            .expect("Content-Type", /application\/json/);
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

        await api.post("/auth/register").send(user).expect(400);
    });

    it("should return status 201 and a new user should be created ", async () => {
        const user = {
            name: "test",
            email: "test@gmail.com",
            password: "test",
        };
        await api.post("/auth/register").send(user).expect(201);
        const users = await User.find({});
        expect(users.length).toBe(1);
        expect(users[0].name).toBe(user.name);
        expect(users[0].email).toBe(user.email);
    });
});
