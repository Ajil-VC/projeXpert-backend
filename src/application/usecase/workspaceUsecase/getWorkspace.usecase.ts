import { Company } from "../../../infrastructure/database/models/company.interface";
import { DecodedData } from "../../shared/decodedData";
import { ICompanyRepository } from "../../../domain/repositories/company.repo";
import { IGetWorkspaceUsecase } from "../../../config/Dependency/user/project.di";



export class GetWorkSpaceUseCase implements IGetWorkspaceUsecase {

    constructor(private _companyRepo: ICompanyRepository) { }

    async execute(user: DecodedData): Promise<Company | null> {

        const companyData = await this._companyRepo.getCompanyWithWorkSpace(user.companyId);
        if (!companyData) return null;

        return companyData;

    }

}