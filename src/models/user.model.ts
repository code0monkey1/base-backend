// create mongoose model for user
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            required: [true, "Email is required"],
        },
        hashedPassword: {
            type: String,
            required: [true, "Password is required"],
        },
    },
    {
        timestamps: true,
    },
);

// delete the __v and the _id fields from the response object
userSchema.set("toJSON", {
    versionKey: false,
    transform: function (doc, ret) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    },
});

export default mongoose.model("User", userSchema);
