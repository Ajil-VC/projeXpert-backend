import { ISubscription } from "../../../domain/repositories/subscription.repo";
import { IWorkspaceRepository } from "../../../domain/repositories/workspace.repo";
import { Subscription } from "../../../infrastructure/database/models/subscription.interface";
import { WorkSpace } from "../../../infrastructure/database/models/workspace.interface";
import { useCaseResult } from "../../shared/useCaseResult";


export class CreateWorkspaceUsecase {

    constructor(private workspaceRepo: IWorkspaceRepository) { }

    async execute(workspaceName: string, companyId: string, userId: string): Promise<useCaseResult> {

        const result = await this.workspaceRepo.createWorkspace(workspaceName, companyId, userId);
        if (!result) {
            throw new Error('Something went wrong while creating workspace');
        }

        return { status: true, message: 'Workspace created successfully', additional: result };
    }
}