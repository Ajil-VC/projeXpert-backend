
import { Schema, model } from "mongoose";
import { User } from "../../domain/entities/user.interface";


const userSchema = new Schema<User>({

    name: { type: String, default: 'New User' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicUrl: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'user'], required: true, default: 'user' },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    workspaceIds: [{ type: Schema.Types.ObjectId, ref: 'Workspace' }],
    defaultWorkspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },

    isBlocked: { type: Boolean, default: false },
    lastActiveProjectId: { type: Schema.Types.ObjectId, ref: 'Project', default: null },

    forceChangePassword: { type: Boolean, default: true },
    systemRole: { type: String, enum: ['platform-admin', 'company-user'], default: 'company-user', required: true }

}, { timestamps: true })


const userModel = model<User>('User', userSchema);
export default userModel;