import { Project } from "../../../infrastructure/database/models/project.interface";
import { IProjectRepository } from "../../../domain/repositories/project.repo";
import { DecodedData } from "../../shared/decodedData";
import { ICreateProject } from "../../../config/Dependency/user/project.di";


export class createProjectUseCase implements ICreateProject {

    constructor(private projectRepo: IProjectRepository) { }

    async execute(projectName: String, workSpace: String, priority: String, user: DecodedData): Promise<Project | null> {

        const createdProject = await this.projectRepo
            .createProject(projectName, workSpace, priority, user.companyId, user.id);

        if (!createdProject) {
            throw new Error('Couldnt create the project. Internal server error.');
        }

        return createdProject;

    }
}