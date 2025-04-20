import { Company } from "../entities/company.interface";


export interface IWorkspaceRepository {

    getCompanyWithWorkSpace(companyId: String): Promise<Company | null>;
}