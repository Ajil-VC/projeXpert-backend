import { IGetProjectsinWorkspaceUsecase } from "../../../config/Dependency/user/project.di";
import { IProjectRepository } from "../../../domain/repositories/project.repo";
import { Project } from "../../../infrastructure/database/models/project.interface";


export class GetAllProjectsInWorkspaceUseCase implements IGetProjectsinWorkspaceUsecase {

    constructor(private _projectRepo: IProjectRepository) { }
    async execute(workSpaceId: String, limit: number, skip: number, filter: Array<string>): Promise<{ projects: Array<Project>, totalPage: number }> {

        const data = await this._projectRepo.getProjects(workSpaceId, limit, skip, filter);
        if (!data) throw new Error('Projects couldnt retrieve');
        return data;

    }
}