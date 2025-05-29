import { useCaseResult } from "../../application/shared/useCaseResult";
import { Company } from "../entities/company.interface";
import { WorkSpace } from "../entities/workspace.interface";


export interface IWorkspaceRepository {

    getCompanyWithWorkSpace(companyId: String): Promise<Company | null>;

    createWorkspace(workspaceName: string, companyId: string): Promise<WorkSpace | useCaseResult>;
}