import mongoose, { model, Schema } from "mongoose";
import { Challenge, Sprint } from "./models/sprint.interface";


const ChallengeSchema = new Schema<Challenge>({
    reportedBy: String,
    description: String,
    impact: String,
    proposedSolution: String,
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
    createdAt: { type: Date, default: Date.now }
}, { _id: true });


const SprintSchema = new Schema<Sprint>({

    name: { type: String, required: true },
    sprintCount: { type: Number },
    description: { type: String },
    goal: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
        type: String,
        enum: ['not-started', 'active', 'completed'],
        default: 'not-started',
    },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],

    plannedPoints: { type: Number, default: 0 },
    completedPoints: { type: Number, default: 0 },
    velocity: { type: Number, default: 0 },
    velocitySnapshot: { type: Number, default: 0 },
    burndownData: { type: [{ date: Date, remainingPoints: Number }], default: [] },
    challenges: [ChallengeSchema]

}, {
    timestamps: true
});

const SprintModel = mongoose.models.Sprint || model<Sprint>('Sprint', SprintSchema);
export default SprintModel;