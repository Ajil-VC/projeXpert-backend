import { IDeleteProjectUsecase } from "../../../config/Dependency/user/project.di";
import { IProjectRepository } from "../../../domain/repositories/project.repo";


export class DeleteProjectUsecase implements IDeleteProjectUsecase {

    constructor(private _projectRepo: IProjectRepository) { }
    async execute(projectId: string, workSpaceId: string): Promise<boolean> {

        const result = await this._projectRepo.deleteProject(projectId, workSpaceId);

        if (result) {
            return true;
        }

        throw new Error('Project couldnt delete successfully');
    }
}