import { IStartSprintUsecase } from "../../../config/Dependency/user/backlog.di";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";


export class StartSprintUsecase implements IStartSprintUsecase {

    constructor(private _backlogRepo: IBacklogRepository) { }

    async execute(sprintId: string, sprintName: string, duration: number, startDate: Date) {

        const result = await this._backlogRepo.startSprint(sprintId, sprintName, duration, startDate);

        if(!result){
            throw new Error('Something went wrong while updating sprint.');
        }

        return result;
    }
}