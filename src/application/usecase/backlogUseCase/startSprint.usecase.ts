import { IStartSprint } from "../../../config/Dependency/user/backlog.di";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";


export class StartSprintUsecase implements IStartSprint {

    constructor(private backlogRepo: IBacklogRepository) { }

    async execute(sprintId: string, sprintName: string, duration: number, startDate: Date) {

        const result = await this.backlogRepo.startSprint(sprintId, sprintName, duration, startDate);

        if(!result){
            throw new Error('Something went wrong while updating sprint.');
        }

        return result;
    }
}