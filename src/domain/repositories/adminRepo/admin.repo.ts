import { Company } from "../../../infrastructure/database/models/company.interface";
import { companySubscription } from "../../../infrastructure/database/models/companySubscription.interface";
import { User } from "../../../infrastructure/database/models/user.interface";


export interface IAdminRepository {

    getAllCompanyDetails(): Promise<any>;

    getAdmin(adminId: string): Promise<User>;
}