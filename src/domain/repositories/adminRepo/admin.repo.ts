
import { AdminInitDTO } from "../../../application/DTO/adminInitDTO";
import { User } from "../../../infrastructure/database/models/user.interface";


export interface IAdminRepository {

    getAllCompanyDetails(limit: number, skip: number, searchTerm: string): Promise<AdminInitDTO>;

    getAdmin(adminId: string): Promise<User>;
}