import { IGetSprintUsecase } from "../../../config/Dependency/user/backlog.di";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { Permissions } from "../../../infrastructure/database/models/role.interface";
import { Sprint } from "../../../infrastructure/database/models/sprint.interface";
import { Task } from "../../../infrastructure/database/models/task.interface";



export class GetSprintsUseCase implements IGetSprintUsecase {

    constructor(private _backlogRepository: IBacklogRepository) { }

    async execute(projectId: string, permissions: Array<Permissions>, userId: string, kanban: boolean = false): Promise<any> {

        const result = await this._backlogRepository.getSprints(projectId);
        if (!result) throw new Error('Error while getting sprints');

        const canViewAll: boolean = permissions.includes('view_all_task');

        const startedSprints = (result as Array<Sprint>).filter(sprint => {

            if (canViewAll) {
                if (kanban) {

                    return sprint.status === 'active';
                }
                return sprint.status !== 'completed'
            } else {
                // Only filter if all tasks are of type Task, otherwise skip assignment to avoid type errors
                const filteredTasks = sprint.tasks.filter((task: any) => {

                    if (
                        typeof task === 'object' && 'assignedTo' in task && task.assignedTo !== null) {
                        return ('_id' in task.assignedTo && String(task.assignedTo._id) === userId)
                    };
                });

                // Assign only if all filtered tasks are Task objects
                if (filteredTasks.every((task: any) => typeof task === 'object' && 'status' in task)) {
                    sprint.tasks = filteredTasks as Task[];
                    if (kanban) {
                        if (sprint.status === 'active' && sprint.tasks.length > 0) {
                            return true;
                        }
                    } else {
                        if (sprint.status !== 'completed' && sprint.tasks.length > 0) {
                            return true;
                        }
                    }
                }
            }
        })

        return startedSprints;

    }
}