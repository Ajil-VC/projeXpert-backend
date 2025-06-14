
import { TaskRepositoryImp } from "../../../infrastructure/repositories/task.repositoryImp";
import { ITaskRepository } from "../../../domain/repositories/task.repo";
import { UpdateTaskDetailsUsecase } from "../../../application/usecase/taskUsecase/updateTask.usecase";
import { CompleteSprintUsecase } from "../../../application/usecase/taskUsecase/completesprint.usecase";

const taskRepository: ITaskRepository = new TaskRepositoryImp();
export const updateTaskDetailsUse = new UpdateTaskDetailsUsecase(taskRepository);
export const completeSprintUse = new CompleteSprintUsecase(taskRepository);