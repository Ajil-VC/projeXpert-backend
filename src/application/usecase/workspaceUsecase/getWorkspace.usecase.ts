import { Company } from "../../../infrastructure/database/models/company.interface";
import { IWorkspaceRepository } from "../../../domain/repositories/workspace.repo";
import { DecodedData } from "../../shared/decodedData";
import { ICompanyRepository } from "../../../domain/repositories/company.repo";
import { IGetWorkspace } from "../../../config/Dependency/user/project.di";



export class GetWorkSpaceUseCase implements IGetWorkspace {

    constructor(private companyRepo: ICompanyRepository) { }

    async execute(user: DecodedData): Promise<Company | null> {

        const companyData = await this.companyRepo.getCompanyWithWorkSpace(user.companyId);
        if (!companyData) return null;

        return companyData;

    }

}