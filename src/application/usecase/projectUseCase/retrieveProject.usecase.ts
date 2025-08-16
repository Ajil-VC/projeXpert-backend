import { IRetrieveProject } from "../../../config/Dependency/user/project.di";
import { IProjectRepository } from "../../../domain/repositories/project.repo";
import { Project } from "../../../infrastructure/database/models/project.interface";




export class RetrieveProjectUseCase implements IRetrieveProject {

    constructor(private projectRepo: IProjectRepository) { }
    async execute(projectId: string):Promise<Project> {

        const result = await this.projectRepo.retrieveProject(projectId);
        return result;
    }
}