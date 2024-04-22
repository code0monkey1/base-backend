import { DecryptInterface } from "../interfaces/cryptography/DecryptInterface";
import { EncryptInterface } from "../interfaces/cryptography/EncryptInterface";
import bcrypt from "bcrypt";
export class EncryptionService implements EncryptInterface, DecryptInterface {
    private readonly SALT_ROUNDS = 10;

    compare = async (
        plainText: string,
        hashedText: string,
    ): Promise<boolean> => {
        return await bcrypt.compare(plainText, hashedText);
    };
    generateHash = async (plainText: string): Promise<string> => {
        return await bcrypt.hash(plainText, this.SALT_ROUNDS);
    };
}
