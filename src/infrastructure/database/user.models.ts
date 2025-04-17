
import { Schema, model } from "mongoose"; 
import { User } from "../../domain/entities/user.interface";


const userSchema = new Schema<User>({

    email: { type: String, required: true, unique: true },
    name: { type: String },
    password: { type: String },
    profilePicUrl: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'user'], required: true, default: 'user' },
    workspaceIds: [{ type: Schema.Types.ObjectId, ref: 'Workspace' }]

}, { timestamps: true })


const userModel = model<User>('User', userSchema);
export default userModel;