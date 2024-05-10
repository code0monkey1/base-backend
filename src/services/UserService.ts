import createHttpError from "http-errors";
import { UserRepository } from "../repositories/UserRepository";
import { EncryptionService } from "./EncryptionService";
import { UserType } from "../models/user.model";

export class UserService {
    constructor(
        private readonly encryptionService: EncryptionService,
        private readonly userRepository: UserRepository,
    ) {}

    async createUser(name: string, email: string, password: string) {
        const hashedPassword = await this.encryptionService.hash(password);

        const user = await this.userRepository.create({
            name,
            email,
            hashedPassword,
        });
        return user;
    }

    async findById(userId: string) {
        const user = await this.userRepository.findById(userId);
        return user;
    }

    async findByIdAndUpdate(
        userId: string,
        payload: Omit<Partial<UserType>, "password">,
    ) {
        const user = await this.userRepository.update(userId, payload);
        return user;
    }

    async findByEmailAndPassword(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);

        const validUser =
            user &&
            (await this.encryptionService.compare(
                password,
                user?.hashedPassword,
            ));

        if (!validUser) {
            const error = createHttpError(400, "UserName or Password Invalid");
            throw error;
        }

        return user;
    }
}
