import { Task } from "../../../infrastructure/database/models/task.interface";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { IGetTasks } from "../../../config/Dependency/user/backlog.di";




export class GetTasksUseCase implements IGetTasks {

    constructor(private backlogRepo: IBacklogRepository) { }

    async execute(projectId: string, userRole: string, userId: string, isKanban: boolean = false) {

        if (!isKanban) {
            const result = await this.backlogRepo.getTasks(projectId, userRole, userId);

            if (!result) {
                throw new Error('Couldnt retrieve tasks');
            }
            return result;

        } else if (isKanban) {

            const activeTasks = await this.backlogRepo.getTasks(projectId, userRole, userId, isKanban);

            const activeTaskIds = activeTasks.map((t: Task) => t._id);

            const availableSubtasks = await this.backlogRepo.getSubtasks('', isKanban, activeTaskIds);

            const allTasks = [...activeTasks, ...availableSubtasks];
            return allTasks;

        }
    }
}