import { User } from "../../../infrastructure/database/models/user.interface";


export interface IAdminRepository {

    getAllCompanyDetails(): Promise<any>;

    getAdmin(adminId: string): Promise<User>;
}