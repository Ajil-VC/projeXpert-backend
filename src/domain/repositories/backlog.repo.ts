import { Sprint } from "../../infrastructure/database/models/sprint.interface";
import { Task } from "../../infrastructure/database/models/task.interface";


export interface IBacklogRepository {

    updateEpic(title: string, description: string, startDate: string, endDate: string, epicId: string): Promise<Task | null>;

    createEpic(title: string, description: string, startDate: string, endDate: string, projectId: string, userId: string): Promise<Task | null>;

    getTasks(projectId: string, userRole: string, userId: string): Promise<any>;

    createIssue(projectId: string, issueType: string, issueName: string, taskGroup: string, epicId: string): Promise<any>;

    assignIssue(issueId: string, userId: string): Promise<any>;

    createSprint(projectId: string, issueIds: Array<string>, userId: string): Promise<any>;

    getSprints(projectId: string): Promise<Sprint[]>;

    dragDropUpdation(prevContainerId: string, containerId: string, movedTaskId: string): Promise<Task>;

    changeTaskStatus(taskId: string, status: string): Promise<Task>;

    startSprint(sprintId: string, sprintName: string, duration: number, startDate: Date): Promise<Sprint>;
}