import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { UserService } from "../../services/UserService";
import { UserType } from "../../models/user.model";

export class UserController {
    constructor(private readonly userService: UserService) {}

    updateById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            //extract the userId from auth and compare it with the userId in the request body
            //if they are not equal, throw an error
            const authRequest = req as AuthRequest;

            if (req.params.userId !== authRequest.auth.userId) {
                const error = createHttpError(401, "Unauthorized");
                return next(error);
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            if (!isValidObjectId(authRequest.auth.userId)) {
                const error = createHttpError(
                    400,
                    "userId is of  invalid type",
                );
                return next(error);
            }

            //if user not found throw an error or update the user

            const userOrError = await this.userService.findById(
                authRequest.auth.userId,
            );

            if (!userOrError) {
                const error = createHttpError(404, "User not found");
                return next(error);
            }

            const { name } = req.body as Partial<UserType>;

            //if they are equal, update the user and return the updated user
            const updatedUser = await this.userService.findByIdAndUpdate(
                authRequest.auth.userId,
                { name },
            );

            res.status(200).json(updatedUser);
        } catch (e) {
            next(e);
        }
    };
}

interface AuthRequest extends Request {
    auth: { userId: string };
}

function isHex(char: string) {
    return parseInt(char, 16).toString(16) === char.toLowerCase();
}

function isValidObjectId(id: string) {
    if (id.length !== 24) return false;
    for (let i = 0; i < id.length; i++) {
        if (!isHex(id[i])) return false;
    }
    return true;
}
