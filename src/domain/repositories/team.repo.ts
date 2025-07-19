import { User } from "../../infrastructure/database/models/user.interface";


export interface ITeamRepository {

    getTeamMembers(projectId: string | null, userId: string): Promise<Array<any>>;

    getCompanyUsers(companyId: string): Promise<User[]>;

    restrictUser(userId: string, status: boolean | null, userRole: string): Promise<User>;

}