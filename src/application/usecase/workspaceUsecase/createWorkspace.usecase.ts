import { ICreateWorkspace } from "../../../config/Dependency/user/workspace.di";
import { IWorkspaceRepository } from "../../../domain/repositories/workspace.repo";
import { useCaseResult } from "../../shared/useCaseResult";


export class CreateWorkspaceUsecase implements ICreateWorkspace {

    constructor(private workspaceRepo: IWorkspaceRepository) { }

    async execute(workspaceName: string, companyId: string, userId: string): Promise<useCaseResult> {

        const result = await this.workspaceRepo.createWorkspace(workspaceName, companyId, userId);
        if (!result) {
            throw new Error('Something went wrong while creating workspace');
        }

        return { status: true, message: 'Workspace created successfully', additional: result };
    }
}