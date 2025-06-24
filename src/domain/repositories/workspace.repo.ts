import { useCaseResult } from "../../application/shared/useCaseResult";
import { Company } from "../../infrastructure/database/models/company.interface";
import { WorkSpace } from "../../infrastructure/database/models/workspace.interface";


export interface IWorkspaceRepository {

    getCompanyWithWorkSpace(companyId: String): Promise<Company | null>;

    createWorkspace(workspaceName: string, companyId: string): Promise<WorkSpace | useCaseResult>;
}