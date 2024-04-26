import { Schema, model } from "mongoose";

const RefreshToken = new Schema(
    {
        expiresAt: { type: Date, required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true },
);

export default model("RefreshToken", RefreshToken);
