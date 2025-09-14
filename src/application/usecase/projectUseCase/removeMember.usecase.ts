import { IRemoveMemberUsecase } from "../../../config/Dependency/user/project.di";
import { IProjectRepository } from "../../../domain/repositories/project.repo";


export class RemoveMemberUseCase implements IRemoveMemberUsecase {

    constructor(private _projectRepo: IProjectRepository) { }

    async execute(projectId: string, userId: string, currUserId: string): Promise<boolean> {

        if (userId === currUserId) {
            throw new Error('Current user and removing user are same.');
        }
        const result = await this._projectRepo.removeMemberFromProject(projectId, userId);
        if (!result) throw new Error('Couldnt remove member from project');
        return true;
    }

}