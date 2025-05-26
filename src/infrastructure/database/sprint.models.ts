import { model, Schema } from "mongoose";
import { Sprint } from "../../domain/entities/sprint.interface";




const SprintSchema = new Schema<Sprint>({

    name: { type: String, required: true },
    sprintCount: { type: Number},
    description: { type: String },
    startDate: { type: Date},
    endDate: { type: Date },
    status: {
        type: String,
        enum: ['not-started', 'active', 'completed'],
        default: 'not-started',
    },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]

}, {
    timestamps: true
});

const SprintModel = model<Sprint>('Sprint', SprintSchema);
export default SprintModel;