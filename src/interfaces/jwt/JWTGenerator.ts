export interface JwtPayload {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}
export interface JWTGenerator {
    generate(payload: JwtPayload): string;
}
