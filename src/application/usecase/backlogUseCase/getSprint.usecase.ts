import { Sprint } from "../../../domain/entities/sprint.interface";
import { Task } from "../../../domain/entities/task.interface";



export class GetSprintsUseCase {

    constructor(private backlogRepository: any) { }

    async execute(projectId: string, userRole: string, userId: string, kanban: boolean = false): Promise<any> {

        const result = await this.backlogRepository.getSprints(projectId);
        if (!result) throw new Error('Error while getting sprints');


        if (kanban) {

            const startedSprints = (result as Array<Sprint>).filter(sprint => {

                if (userRole === 'admin') {
                    return sprint.status !== 'not-started';
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
                        if(sprint.status !== 'not-started' && sprint.tasks.length > 0){
                            return true;
                        }
                    }
                }
            })

            return startedSprints;

        }

        return result;
    }
}