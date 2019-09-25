import { Document, Model, model, Schema } from "mongoose";
import { User } from "../model/user";

export const UserSchema: Schema = new Schema({
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    phone: String,
    userStatus: Number,
    username: String
});

interface UserModel extends User, Document {
}

export const UserModel: Model<UserModel> = model("User", UserSchema);
