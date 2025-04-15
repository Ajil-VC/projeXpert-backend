import { Schema, model } from "mongoose"
import { Project } from "../../domain/entities/project.interface"


const projectSchema = new Schema<Project>({

    name: { type: String, required: true },
    workSpace: { type: Schema.Types.ObjectId, required: true, ref: 'Workspace' },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: { type: String, enum: ['active', 'archived', 'completed'], default: 'active' },
    priority: {
        type: String, enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium'
    },

}, { timestamps: true })