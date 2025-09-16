
import { GetSprintWithIDUseCase } from "../../application/usecase/taskUsecase/getsprintWithId.usecase";
import { GetTask } from "../../application/usecase/taskUsecase/getTask.usecase";
import { IGetSprintWithIDUsecase } from "../../config/Dependency/user/backlog.di";
import { IGetTaskUsecase } from "../../config/Dependency/user/task.di";
import { ITaskRepository } from "../../domain/repositories/task.repo";
import { AuthorizeMiddleware } from "../../infrastructure/middleware/authorize.middleware";
import { PlanPolicyMiddleware } from "../../infrastructure/middleware/planpolicy.middleware";
import { SprintMiddleware } from "../../infrastructure/middleware/sprint.middleware";
import { TaskRepositoryImp } from "../../infrastructure/repositories/repoImplementations/task.repositoryImp";



export const autherizer = new AuthorizeMiddleware();
export const planPolicyMiddleware = new PlanPolicyMiddleware();
const taskRepository: ITaskRepository = new TaskRepositoryImp();
const getTaskUse: IGetTaskUsecase = new GetTask(taskRepository);

const getSprintWithIDUsecase: IGetSprintWithIDUsecase = new GetSprintWithIDUseCase(taskRepository);
export const issue = new SprintMiddleware(getSprintWithIDUsecase, getTaskUse);