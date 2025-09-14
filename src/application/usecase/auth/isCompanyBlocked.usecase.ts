import { ICompanyRepository } from "../../../domain/repositories/company.repo";



export class IsCompanyBlockedUsecase {

    constructor(private _companyRepo: ICompanyRepository) { }
    async execute(companyId: string) {
        const result = await this._companyRepo.findCompanyById(companyId);
        return result;
    }
}