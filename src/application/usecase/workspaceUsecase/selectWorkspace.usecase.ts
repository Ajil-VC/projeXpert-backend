import { ISelectWorkspace } from "../../../config/Dependency/user/workspace.di";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { IWorkspaceRepository } from "../../../domain/repositories/workspace.repo";
import { WorkSpace } from "../../../infrastructure/database/models/workspace.interface";


export class SelectWorkspaceUsecase implements ISelectWorkspace {

    constructor(private workspace: IWorkspaceRepository, private userRepo: IUserRepository) { }

    async execute(workspaceId: string, userId: string): Promise<WorkSpace> {

        const [user, workspace] = await Promise.all([
            this.userRepo.updateDefaultWorkspace(workspaceId, userId),
            this.workspace.getWorkspace(workspaceId)
        ]);

        return workspace;

    }

}