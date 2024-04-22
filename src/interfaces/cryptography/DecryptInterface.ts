export interface DecryptInterface {
    compare: (data: string, hashedData: string) => Promise<boolean> | boolean;
}
