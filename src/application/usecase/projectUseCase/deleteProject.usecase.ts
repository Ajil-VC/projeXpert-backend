import { IProjectRepository } from "../../../domain/repositories/project.repo";


export class DeleteProjectUsecase {

    constructor(private projectRepo: IProjectRepository) { }
    async execute(projectId: string, workSpaceId: string): Promise<boolean> {

        const result = await this.projectRepo.deleteProject(projectId, workSpaceId);
        console.log(result, '4 yes')
        if (result) {
            return true;
        }
        return false;
    }
}