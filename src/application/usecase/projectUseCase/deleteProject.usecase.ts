import { IDeleteProject } from "../../../config/Dependency/user/project.di";
import { IProjectRepository } from "../../../domain/repositories/project.repo";


export class DeleteProjectUsecase implements IDeleteProject {

    constructor(private projectRepo: IProjectRepository) { }
    async execute(projectId: string, workSpaceId: string): Promise<boolean> {

        const result = await this.projectRepo.deleteProject(projectId, workSpaceId);

        if (result) {
            return true;
        }

        throw new Error('Project couldnt delete successfully');
    }
}