import { model, Schema } from "mongoose";
import { WorkSpace } from "../../domain/entities/workspace.interface";


const workSpaceSchema = new Schema<WorkSpace>({

    name: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    companyId: { type: Schema.Types.ObjectId },
    
    projects : [{type : Schema.Types.ObjectId, ref: 'Project'}],    
    currentProject: { type: Schema.Types.ObjectId, ref: 'Project' },

}, { timestamps: true });

const workSpaceModel = model<WorkSpace>('Workspace', workSpaceSchema);
export default workSpaceModel;