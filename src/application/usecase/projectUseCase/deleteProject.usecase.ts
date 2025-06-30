import { IProjectRepository } from "../../../domain/repositories/project.repo";


export class DeleteProjectUsecase {

    constructor(private projectRepo: IProjectRepository) { }
    async execute(projectId: string, workSpaceId: string): Promise<boolean> {

        const result = await this.projectRepo.deleteProject(projectId, workSpaceId);

        if (result) {
            return true;
        }

        throw new Error('Project couldnt delete successfully');
    }
}