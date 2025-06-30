import { IProjectRepository } from "../../../domain/repositories/project.repo";


export class GetAllProjectsInWorkspaceUseCase {

    constructor(private projectRepo: IProjectRepository) { }
    async execute(workSpaceId: String) {

        const data = await this.projectRepo.getProjects(workSpaceId);
        if (!data) throw new Error('Projects couldnt retrieve');
        return data;

    }
}