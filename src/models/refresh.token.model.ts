import { Schema, model } from "mongoose";

export interface RefreshTokenType {
    user: string;
    expiresAt: Date;
}

const RefreshToken = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true },
);

export default model("RefreshToken", RefreshToken);
