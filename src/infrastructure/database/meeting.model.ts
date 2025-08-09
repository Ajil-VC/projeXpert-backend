import mongoose, { model, ObjectId, Schema } from "mongoose";
import { Meeting } from "./models/meeting.interface";


const MeetingSchema = new Schema<Meeting>({

    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    roomName: { type: String, default: 'New Room' },
    meetingDate: { type: Date, required: true },
    meetingTime: { type: String, required: true },
    description: { type: String },
    members: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], ref: 'User' },
    status: { type: String, enum: ['upcoming', 'ongoing', 'completed'] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },

    url: { type: String, required: true },
    roomId: { type: String, required: true }

}, { timestamps: true });

const MeetingModel = mongoose.models.Meeting || model<Meeting>('Meeting', MeetingSchema);
export default MeetingModel;