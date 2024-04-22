export interface SignInterface<T> {
    sign: (data: T, jwt_secret: string) => string;
}
