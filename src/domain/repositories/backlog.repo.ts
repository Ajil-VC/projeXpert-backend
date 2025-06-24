import { Task } from "../../infrastructure/database/models/task.interface";


export interface IBacklogRepository {

    createEpic(epicName: string, projectId: string): Promise<Task | null>;

    getTasks(projectId: string, userRole: string, userId: string): Promise<any>;

    createIssue(projectId: string, issueType: string, issueName: string, taskGroup: string, epicId: string): Promise<any>;

    assignIssue(issueId: string, userId: string): Promise<any>;

    createSprint(projectId: string, issueIds: Array<string>, userId: string): Promise<any>;

    getSprints(projectId: string): Promise<any>;

    dragDropUpdation(prevContainerId: string, containerId: string, movedTaskId: string): Promise<any>;

    changeTaskStatus(taskId: string, status: string): Promise<any>;

    startSprint(sprintId: string, sprintName: string, duration: number, startDate: Date): Promise<any>;
}