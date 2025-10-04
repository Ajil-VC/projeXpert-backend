import { Project } from "../../../infrastructure/database/models/project.interface";
import { IProjectRepository } from "../../../domain/repositories/project.repo";
import { DecodedData } from "../../shared/decodedData";
import { ICreateProjectUsecase } from "../../../config/Dependency/user/project.di";


export class createProjectUseCase implements ICreateProjectUsecase {

    constructor(private _projectRepo: IProjectRepository) { }

    async execute(projectName: string, workSpace: string, priority: string, user: DecodedData): Promise<Project | null> {

        const createdProject = await this._projectRepo
            .createProject(projectName, workSpace, priority, user.companyId, user.id);

        if (!createdProject) {
            throw new Error('Couldnt create the project. Internal server error.');
        }

        return createdProject;

    }
}