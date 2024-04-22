import supertest from "supertest";
import app from "../../src/app";

const api = supertest(app);
describe("PORT /register", () => {
    it("should return 201 status code", async () => {
        await api.post("/register").expect(201);
    });

    it("should return valid json response", async () => {
        await api.post("/register").expect("Content-Type", /application\/json/);
    });
});
