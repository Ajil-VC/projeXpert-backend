import mongoose, { model, Schema } from "mongoose";
import { WorkSpace } from "./models/workspace.interface";


const workSpaceSchema = new Schema<WorkSpace>({

    name: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    companyId: { type: Schema.Types.ObjectId },

    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    currentProject: { type: Schema.Types.ObjectId, ref: 'Project' },

}, { timestamps: true });

const workSpaceModel = mongoose.models.Workspace || model<WorkSpace>('Workspace', workSpaceSchema);
export default workSpaceModel;