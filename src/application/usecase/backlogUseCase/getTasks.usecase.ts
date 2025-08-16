import { Task } from "../../../infrastructure/database/models/task.interface";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { IGetTasks } from "../../../config/Dependency/user/backlog.di";




export class GetTasksUseCase implements IGetTasks {

    constructor(private backlogRepo: IBacklogRepository) { }

    async execute(projectId: string, userRole: string, userId: string, isKanban: boolean = false) {

        const result = await this.backlogRepo.getTasks(projectId, userRole, userId);
        if (!result) {
            throw new Error('Couldnt retrieve tasks');
        }

        if (isKanban) {

            const tasksInActiveSprint = (result as Array<Task>).filter(task => {

                if (userRole === 'admin') {
                    return (task.sprintId && 'status' in task.sprintId && task.sprintId.status === 'active')
                } else {

                    if (task.sprintId && 'status' in task.sprintId && task.sprintId.status === 'active') {
                        return (task.assignedTo !== null && '_id' in task.assignedTo && String(task.assignedTo._id) === userId);
                    }
                }
            });

            return tasksInActiveSprint;

        }
        return result;
    }
}