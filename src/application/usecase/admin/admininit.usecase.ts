import { IAdminRepository } from "../../../domain/repositories/adminRepo/admin.repo";



export class AdminInitUseCase {

    constructor(private adminRepo : IAdminRepository) { }
    async execute(): Promise<any> {

        const result = await this.adminRepo.getAllCompanyDetails();
        if(!result){
            throw new Error('Couldnt retrieve company details.');
        }

        return result;
    }
}