import { IProjectStatus } from "../../../config/Dependency/user/project.di";
import { IProjectRepository } from "../../../domain/repositories/project.repo";
import { Sprint } from "../../../infrastructure/database/models/sprint.interface";
import { Task } from "../../../infrastructure/database/models/task.interface";



export class ProjectStatsUseCase implements IProjectStatus {

    constructor(private projectRepo: IProjectRepository) { }

    async execute(projectId: string, userId: string, userRole: 'admin' | 'user', companyId: string) {

        const result = await this.projectRepo.projectStats(projectId, userId, userRole, companyId);

        const today = new Date();
        const DUE_SOON_DAYS = 3;

        const groupData = result.reduce((acc: { epics: Task[], completed: Task[]; openTasks: Task[]; dueSoon: Task[]; overdue: Task[], unscheduled: Task[] }, task: Task) => {

            let endDate = null;
            if (task.sprintId) {
                endDate = (task.sprintId as Sprint).endDate || null;
            }
            if (task.type === "epic") {
                acc.epics.push(task);
            } else if (task.status === "done") {
                acc.completed.push(task)
            } else if (endDate) {

                const diffInDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                if (endDate < today) {
                    acc.overdue.push(task);
                } else if (diffInDays <= DUE_SOON_DAYS) {
                    acc.dueSoon.push(task);
                } else {
                    acc.openTasks.push(task);
                }
            } else {
                acc.unscheduled.push(task);
            }


            return acc;

        }, {
            epics: [] as Task[],
            completed: [] as Task[],
            openTasks: [] as Task[],
            dueSoon: [] as Task[],
            overdue: [] as Task[],
            unscheduled: [] as Task[]
        });

        return groupData;
    }
}