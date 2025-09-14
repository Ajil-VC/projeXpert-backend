import { ISelectWorkspaceUsecase } from "../../../config/Dependency/user/workspace.di";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import { IWorkspaceRepository } from "../../../domain/repositories/workspace.repo";
import { WorkSpace } from "../../../infrastructure/database/models/workspace.interface";


export class SelectWorkspaceUsecase implements ISelectWorkspaceUsecase {

    constructor(private _workspace: IWorkspaceRepository, private _userRepo: IUserRepository) { }

    async execute(workspaceId: string, userId: string): Promise<WorkSpace> {

        const [user, workspace] = await Promise.all([
            this._userRepo.updateDefaultWorkspace(workspaceId, userId),
            this._workspace.getWorkspace(workspaceId)
        ]);

        return workspace;

    }

}