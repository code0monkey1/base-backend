import { RefreshTokenType } from "../models/refresh.token.model";
import RefreshToken from "../models/refresh.token.model";
export class RefreshTokenRepository {
    constructor() {}
    async createRefreshToken(refreshToken: RefreshTokenType) {
        return await RefreshToken.create(refreshToken);
    }
    async deleteRefreshToken(id: string) {
        return await RefreshToken.findByIdAndDelete(id);
    }
}
