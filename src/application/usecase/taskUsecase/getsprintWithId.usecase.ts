import { IGetSprintWithIDUsecase } from "../../../config/Dependency/user/backlog.di";
import { ITaskRepository } from "../../../domain/repositories/task.repo";
import { Sprint } from "../../../infrastructure/database/models/sprint.interface";


export class GetSprintWithIDUseCase implements IGetSprintWithIDUsecase {

    constructor(private _taskRepo: ITaskRepository) { }

    async execute(sprintId: string): Promise<Sprint> {

        const sprint = await this._taskRepo.getSprintWithID(sprintId);
        return sprint;
    }


}