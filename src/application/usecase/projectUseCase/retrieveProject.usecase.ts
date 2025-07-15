import { IProjectRepository } from "../../../domain/repositories/project.repo";




export class RetrieveProjectUseCase {

    constructor(private projectRepo: IProjectRepository) { }
    async execute(projectId: string) {

        const result = await this.projectRepo.retrieveProject(projectId);
        return result;
    }
}