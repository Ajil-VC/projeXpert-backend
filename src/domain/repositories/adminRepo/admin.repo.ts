
import { User } from "../../../infrastructure/database/models/user.interface";


export interface IAdminRepository {

    getAllCompanyDetails(limit: number, skip: number, searchTerm: string): Promise<{ companyData: any, totalPages: number }>;

    getAdmin(adminId: string): Promise<User>;
}