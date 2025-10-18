import { useCaseResult } from "../../application/shared/useCaseResult";
import { Company } from "../../infrastructure/database/models/company.interface";


export interface ICompanyRepository {

    activeCompanySubscriptions(): Promise<number>;
    getCompanyWithWorkSpace(companyId: string): Promise<Company | null>;

    getTotalCompanyCountWithLastJoined(): Promise<{ totalCompanyCount: number, lastMonthJoinedCount: number }>;

    findCompanyById(companyId: string): Promise<Company>;
    findCompanyByEmail(email: string): Promise<Company | null>;
    createCompany(companyName: string, email: string): Promise<string | useCaseResult>;
    createWorkspace(name: string, companyId: string): Promise<string | useCaseResult>;

    updateCompanyDetails(company: Company): Promise<Company>;
    changeCompanyStatus(companyId: string, status: boolean): Promise<boolean>;

}