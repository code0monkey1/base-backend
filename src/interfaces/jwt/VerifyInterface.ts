export interface VerifyInterface<T> {
    verify(token: string, jwtSecret: string): T;
}
