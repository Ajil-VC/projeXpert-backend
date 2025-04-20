import { Company } from "../../../domain/entities/company.interface";
import { IWorkspaceRepository } from "../../../domain/repositories/workspace.repo";
import { DecodedData } from "../../shared/decodedData";



export class GetWorkSpaceUseCase {

    constructor(private workSpaceRepo: IWorkspaceRepository) { }

    async execute(user: DecodedData):Promise<Company | null> {

        const companyData = await this.workSpaceRepo.getCompanyWithWorkSpace(user.companyId);
        if(!companyData) return null;
        
        return companyData;

    }

}