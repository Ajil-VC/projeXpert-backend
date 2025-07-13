import { useCaseResult } from "../../application/shared/useCaseResult";
import { Company } from "../../infrastructure/database/models/company.interface";
import { WorkSpace } from "../../infrastructure/database/models/workspace.interface";


export interface ICompanyRepository {

    findCompanyById(companyId: string): Promise<any>;
    findCompanyByEmail(email: string): Promise<Company | null>;
    createCompany(companyName: string, email: string): Promise<string | useCaseResult>;
    createWorkspace(name: string, companyId: string): Promise<string | useCaseResult>;

    updateCompanyDetails(company: Company): Promise<Company>;
    changeCompanyStatus(companyId: string, status: boolean): Promise<any>;

}