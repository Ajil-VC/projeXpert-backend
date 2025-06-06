import { ICompanyRepository } from "../../../domain/repositories/company.repo";



export class IsCompanyBlockedUsecase {

    constructor(private companyRepo: ICompanyRepository) { }
    async execute(companyId: string) {
        const result = await this.companyRepo.findCompanyById(companyId);
        return result;
    }
}