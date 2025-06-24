import mongoose, { Types } from "mongoose";
import { IWorkspaceRepository } from "../../domain/repositories/workspace.repo";
import companyModel from "../database/company.models";
import { Company } from "../database/models/company.interface";
import { WorkSpace } from "../database/models/workspace.interface";
import { useCaseResult } from "../../application/shared/useCaseResult";
import workSpaceModel from "../database/workspace.models";



export class WorkspaceRepoImp implements IWorkspaceRepository {

    async createWorkspace(workspaceName: string, companyId: string): Promise<WorkSpace | useCaseResult> {
    
            try {
    
                const companyObjectId = new Types.ObjectId(companyId);
                if (!Types.ObjectId.isValid(companyObjectId)) throw new Error('Company Id is not valid ObjectId');
    
                const newWorkSpace = new workSpaceModel({
                    name: workspaceName,
                    companyId: companyObjectId,
                })
    
                const createdWorkSpace = await newWorkSpace.save();
                if (!createdWorkSpace) throw new Error('Workspace not Saved');
    
                const companyData = await companyModel.findById(new Types.ObjectId(companyId));
                if (!companyData) return { status: false, message: 'No company data found' };
                companyData.workspaces.push(createdWorkSpace._id);
                await companyData.save();
    
          
                return createdWorkSpace;
    
            } catch (err) {
                console.error('Something went wrong while creating workspace.', err);
                throw new Error('Something went wrong while creating workspace.');
            }
    
        }
    


    async getCompanyWithWorkSpace(companyId: String): Promise<Company | null> {

        if (typeof companyId !== 'string') return null;
        const companyIdOb = new mongoose.Types.ObjectId(companyId)
        const companyData = await companyModel.findById(companyIdOb).populate('workspaces');
        return companyData;

    }

}