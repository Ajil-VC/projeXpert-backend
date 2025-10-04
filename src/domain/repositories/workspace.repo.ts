import { useCaseResult } from "../../application/shared/useCaseResult";
import { WorkSpace } from "../../infrastructure/database/models/workspace.interface";


export interface IWorkspaceRepository {

    createWorkspace(workspaceName: string, companyId: string, userId: string): Promise<WorkSpace | useCaseResult>;

    getWorkspace(workspaceId: string): Promise<WorkSpace>;

    countWorkspace(companyId: string): Promise<number>;
}