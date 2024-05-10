import express, { NextFunction, Request, Response } from "express";
import logger from "./config/logger";
import { HttpError } from "http-errors";
const app = express();
import authRouter from "./routes/authentication-routes";

import userRouter from "./routes/user-routes";
import cookieParse from "cookie-parser";

const cookieParser = cookieParse();

app.use(express.json());

app.get("/data", (req, res) => {
    res.json({ data: "yes it did" });
});

app.use(cookieParser);

app.use("/auth", authRouter);

app.use("/users", userRouter);

app.use(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (error: HttpError, req: Request, res: Response, _next: NextFunction) => {
        logger.error(error.message);
        const statusCode = error.statusCode || error.status || 500;

        res.status(statusCode).json({
            errors: [
                {
                    type: error.message,
                    path: "",
                    location: "",
                },
            ],
        });
    },
);

export default app;
