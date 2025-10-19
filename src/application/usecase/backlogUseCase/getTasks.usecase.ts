
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { IGetTasksUsecase } from "../../../config/Dependency/user/backlog.di";
import { Permissions } from "../../../infrastructure/database/models/role.interface";
import { DeepPopulatedTask } from "../../../infrastructure/database/models/task.interface";




export class GetTasksUseCase implements IGetTasksUsecase {

    constructor(private _backlogRepo: IBacklogRepository) { }

    async execute(projectId: string, permissions: Array<Permissions>, userId: string, isKanban: boolean = false): Promise<DeepPopulatedTask> {

        if (!isKanban) {
            const result = await this._backlogRepo.getTasks(projectId, permissions, userId);

            if (!result) {
                throw new Error('Couldnt retrieve tasks');
            }
            return result;

        } else if (isKanban) {

            const activeTasks = await this._backlogRepo.getTasks(projectId, permissions, userId, isKanban);
            return activeTasks;

        }
        throw new Error('No Data Available.');
    }
}