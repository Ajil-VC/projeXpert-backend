import mongoose from "mongoose";
import { IWorkspaceRepository } from "../../domain/repositories/workspace.repo";
import companyModel from "../database/company.models";
import { Company } from "../../domain/entities/company.interface";



export class WorkspaceRepoImp implements IWorkspaceRepository {


    async getCompanyWithWorkSpace(companyId: String): Promise<Company | null> {

        if (typeof companyId !== 'string') return null;
        const companyIdOb = new mongoose.Types.ObjectId(companyId)
        const companyData = await companyModel.findById(companyIdOb).populate('workspaces');
        return companyData;

    }

}