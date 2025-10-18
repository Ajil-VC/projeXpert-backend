import { ICompanyStatusChangeUsecase } from "../../../config/Dependency/admin/comapanymanage.di";
import { ICompanyRepository } from "../../../domain/repositories/company.repo";

export class ChangeCompanyStatusUsecase implements ICompanyStatusChangeUsecase {

    constructor(private _companyRepo: ICompanyRepository) { }

    async execute(companyId: string, status: boolean): Promise<boolean> {

        const result = await this._companyRepo.changeCompanyStatus(companyId, status);
        return result;
    }
}