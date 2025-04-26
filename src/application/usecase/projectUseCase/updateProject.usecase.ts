import { IProjectRepository } from "../../../domain/repositories/project.repo";


export class UpdateProjectUseCase {

    constructor(private projectRepo: IProjectRepository) { }

    async execute(
        projectId: string,
        projectName: string,
        status: string,
        priority: string): Promise<any> {

        const result = await this.projectRepo.updateProject(projectId, projectName, status, priority);

        if(!result) throw new Error('Error occured while updating the project.');
        return result;

    }
}