import { useCaseResult } from "../../application/shared/useCaseResult";
import { Company } from "../entities/company.interface";
import { WorkSpace } from "../entities/workspace.interface";


export interface ICompanyRepository {

    findCompanyByEmail(email: string): Promise<Company | null>;
    createCompany(companyName: string, email: string): Promise<string | useCaseResult>;
    createWorkspace(name: string, companyId: string): Promise<string | useCaseResult>;

}