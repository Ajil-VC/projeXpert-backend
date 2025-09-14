
import { useCaseResult } from "../../../application/shared/useCaseResult";
import { WorkSpace } from "../../../infrastructure/database/models/workspace.interface";


export interface ICreateWorkspaceUsecase {
    execute(workspaceName: string, companyId: string, userId: string): Promise<useCaseResult>
}

export interface ISelectWorkspaceUsecase {
    execute(workspaceId: string, userId: string): Promise<WorkSpace>;
}