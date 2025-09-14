import { TaskAction } from "../../../domain/entities/types/task.types";
import { TaskHistoryParams } from "../../../domain/entities/types/taskHistoryParams";
import { TaskHistory } from "../../../infrastructure/database/models/taskhistory.interface";



export interface ITaskHistoryUsecase {

    execute(params: TaskHistoryParams): Promise<void>;

}


export interface IGetTaskHistoryUsecase {
    execute(taskId: string): Promise<TaskHistory[]>;
}