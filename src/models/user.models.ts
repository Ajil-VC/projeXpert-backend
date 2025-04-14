
import { ObjectId } from "mongoose";
import { Schema, Document, model } from "mongoose";

export interface User extends Document {

    _id: ObjectId;
    name: String;
    email: String;
    password?: String; //Optional for google auth users.
    profilePicUrl: String;
    role: 'admin' | 'user';
    isGoogleAccount: boolean;
    googleId?: String; // Only for google auth
    plan: 'Free' | 'Pro' | 'Enterprise';
    workspaceIds: ObjectId[];

    createdAt?: Date;
    updatedAt?: Date;

}   

const userSchema = new Schema<User>({

    email: { type: String, required: true, unique: true },
    name: { type: String },
    password: { type: String },
    profilePicUrl: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'user'], required: true, default: 'user' },
    isGoogleAccount: { type: Boolean, default: false },
    googleId: { type: String },
    plan: { type: String, enum: ['Free', 'Pro', 'Enterprise'], default: 'Free' },
    workspaceIds: [{ type: Schema.Types.ObjectId, ref: 'Workspace' }]

}, { timestamps: true })


const userModel = model<User>('User', userSchema);
export default userModel;