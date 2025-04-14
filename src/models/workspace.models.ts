import { Document, model, ObjectId, Schema } from "mongoose";


export interface WorkSpace extends Document {

    _id: ObjectId;
    name: String;
    owner: ObjectId;
    members: ObjectId[];
    isDefault: Boolean;

    createdAt?: Date;
    updatedAt?: Date;
}

const workSpaceSchema = new Schema<WorkSpace>({

    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isDefault: { type: Boolean, default: false }

}, { timestamps: true });

const workSpaceModel = model<WorkSpace>('Workspace', workSpaceSchema);
export default workSpaceModel;