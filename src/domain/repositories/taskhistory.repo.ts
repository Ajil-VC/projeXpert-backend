import { TaskHistory } from "../../infrastructure/database/models/taskhistory.interface";
import { TaskHistoryParams } from "../entities/types/taskHistoryParams";


export interface ITaskHistoryRepository {

    addHistory(params: TaskHistoryParams): Promise<void>;

    getTaskHistory(taskId: string): Promise<TaskHistory[]>;
}