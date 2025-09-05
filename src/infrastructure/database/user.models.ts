
import mongoose, { Schema, model } from "mongoose";
import { User } from "./models/user.interface";

const userSchema = new Schema<User>({

    name: { type: String, default: 'New User' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicUrl: {
        type: {
            public_id: { type: String, required: true },
            url: { type: String, required: true }
        },
        default: null
    },
    role: { type: Schema.Types.ObjectId, required: true, ref: 'Roles' },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', default: null },
    workspaceIds: [{ type: Schema.Types.ObjectId, ref: 'Workspace' }],
    defaultWorkspace: { type: Schema.Types.ObjectId, ref: 'Workspace', default: null },

    isBlocked: { type: Boolean, default: false },
    restrict: { type: Boolean, default: false },
    lastActiveProjectId: { type: Schema.Types.ObjectId, ref: 'Project', default: null },

    forceChangePassword: { type: Boolean, default: true },
    systemRole: { type: String, enum: ['platform-admin', 'company-user'], default: 'company-user', required: true }

}, { timestamps: true })


const userModel = mongoose.models.User || model<User>('User', userSchema);
export default userModel;