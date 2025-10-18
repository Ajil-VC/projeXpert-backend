import { IGetCurrentProjectUsecase } from "../../../config/Dependency/user/project.di";
import { IProjectRepository } from "../../../domain/repositories/project.repo";
import { Project } from "../../../infrastructure/database/models/project.interface";


export class GetProjectUseCase implements IGetCurrentProjectUsecase {

    constructor(private _projectRepo: IProjectRepository) { }
    async execute(workSpaceId: string, projectId: string): Promise<Project | null> {

        const result = await this._projectRepo.getCurProject(workSpaceId, projectId);
        if (!result) throw new Error('Somthing went wrong while fetching project data.');
        return result;
    }
}