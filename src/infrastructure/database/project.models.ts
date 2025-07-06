import mongoose, { Schema, model } from "mongoose"
import { Project } from "./models/project.interface"


const projectSchema = new Schema<Project>({

    name: { type: String, required: true },
    workSpace: { type: Schema.Types.ObjectId, required: true, ref: 'Workspace' },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    status: { type: String, enum: ['active', 'archived', 'completed'], default: 'active' },
    priority: {
        type: String, enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },

}, { timestamps: true })

const projectModel = mongoose.models.Project || model<Project>('Project', projectSchema);
export default projectModel;