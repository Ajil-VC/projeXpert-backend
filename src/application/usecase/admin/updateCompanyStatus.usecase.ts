import { ICompanyRepository } from "../../../domain/repositories/company.repo";

export class ChangeCompanyStatusUsecase {

    constructor(private companyRepo: ICompanyRepository) { }

    async execute(companyId: string, status: boolean): Promise<any> {

        const result = await this.companyRepo.changeCompanyStatus(companyId, status);
        return result;
    }
}