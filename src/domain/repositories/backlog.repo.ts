import { Permissions } from "../../infrastructure/database/models/role.interface";
import { Sprint } from "../../infrastructure/database/models/sprint.interface";
import { Task } from "../../infrastructure/database/models/task.interface";


export interface IBacklogRepository {

    getCompletedSprintsDetails(projectId: string): Promise<Array<Sprint>>;

    getTasksInSprint(sprintId: string): Promise<Array<Task>>;

    updateEpic(title: string, description: string, startDate: string, endDate: string, status: string, epicId: string): Promise<Task | null>;

    createEpic(title: string, description: string, startDate: string, endDate: string, projectId: string, userId: string): Promise<Task | null>;

    getTasks(projectId: string, permissions: Array<Permissions>, userId: string, isKanban?: boolean): Promise<any>;

    removeTask(taskId: string): Promise<boolean>;

    createIssue(projectId: string, issueType: string, issueName: string, taskGroup: string, epicId: string): Promise<any>;

    createSubtask(title: string, type: string, parentId: string, projectId: string): Promise<Task>;

    assignIssue(issueId: string, userId: string): Promise<any>;

    createSprint(projectId: string, issueIds: Array<string>, userId: string): Promise<any>;

    getSprints(projectId: string): Promise<Sprint[]>;

    dragDropUpdation(prevContainerId: string, containerId: string, movedTaskId: string): Promise<Task>;

    changeTaskStatus(taskId: string, status: string): Promise<Task | null>;

    startSprint(sprintId: string, sprintName: string, duration: number, startDate: Date): Promise<Sprint>;

    isActiveSprint(projectId: string): Promise<boolean>;
}