import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";


export class CreateSprintUsecase {
    constructor(private backlogRepo: IBacklogRepository) { }
    
    async execute(projectId: string, sprintIds:Array<string>,userId:string): Promise<any> {
        console.log(projectId,sprintIds,'Create sprint usecase');
        const result = this.backlogRepo.createSprint(projectId, sprintIds, userId);
        if (!result) throw new Error('Error while creating sprint');
        return result;
    }
}