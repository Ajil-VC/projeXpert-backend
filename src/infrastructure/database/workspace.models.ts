import { model, Schema } from "mongoose";
import { WorkSpace } from "../../domain/entities/workspace.interface";


const workSpaceSchema = new Schema<WorkSpace>({

    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isDefault: { type: Boolean, default: false }

}, { timestamps: true });

const workSpaceModel = model<WorkSpace>('Workspace', workSpaceSchema);
export default workSpaceModel;