import { Task } from "../../../infrastructure/database/models/task.interface";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { IGetTasks } from "../../../config/Dependency/user/backlog.di";
import { Permissions } from "../../../infrastructure/database/models/role.interface";




export class GetTasksUseCase implements IGetTasks {

    constructor(private backlogRepo: IBacklogRepository) { }

    async execute(projectId: string, permissions: Array<Permissions>, userId: string, isKanban: boolean = false) {

        if (!isKanban) {
            const result = await this.backlogRepo.getTasks(projectId, permissions, userId);

            if (!result) {
                throw new Error('Couldnt retrieve tasks');
            }
            return result;

        } else if (isKanban) {

            const activeTasks = await this.backlogRepo.getTasks(projectId, permissions, userId, isKanban);

            const activeTaskIds = activeTasks.map((t: Task) => t._id);

            let availableSubtasks: Task[] = [];
            if (permissions.includes('view_all_task')) {
                availableSubtasks = await this.backlogRepo.getSubtasks('', isKanban, activeTaskIds);
            }

            const allTasks = [...activeTasks, ...availableSubtasks];
            return allTasks;

        }
    }
}