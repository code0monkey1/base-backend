export interface EncryptInterface {
    generateHash: (data: string) => Promise<string> | string;
}
