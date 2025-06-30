import { IProjectRepository } from "../../../domain/repositories/project.repo";


export class GetProjectUseCase {

    constructor(private projectRepo: IProjectRepository) { }
    async execute(workSpaceId: string, projectId: string) {

        const result = await this.projectRepo.getCurProject(workSpaceId, projectId);
        if (!result) throw new Error('Somthing went wrong while fetching project data.');
        return result;
    }
}