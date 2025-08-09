import { CreateEpicUsecase } from "../../../application/usecase/backlogUseCase/createEpic.usecase";
import { GetTasksUseCase } from "../../../application/usecase/backlogUseCase/getTasks.usecase";
import { CreateIssueUsecase } from "../../../application/usecase/backlogUseCase/createIssue.usecase";
import { AssignIssueUseCase } from "../../../application/usecase/backlogUseCase/assignIssue.usecase";
import { CreateSprintUsecase } from "../../../application/usecase/backlogUseCase/createSprint.usecase";
import { GetSprintsUseCase } from "../../../application/usecase/backlogUseCase/getSprint.usecase";
import { DragDropUseCase } from "../../../application/usecase/backlogUseCase/dragDrop.usecase";
import { ChangeTaskStatus } from "../../../application/usecase/backlogUseCase/changeTaskStatus.usecase";
import { StartSprintUsecase } from "../../../application/usecase/backlogUseCase/startSprint.usecase";

import { BacklogRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/backlog.repositoryImp";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { UpdateEpicUsecase } from "../../../application/usecase/backlogUseCase/updateEpic.usecase";
import { IsActiveSprintUsecase } from "../../../application/usecase/backlogUseCase/isActiveSprint.usecase";

const backlogRepository: IBacklogRepository = new BacklogRepositoryImp();

export const updateEpicUse = new UpdateEpicUsecase(backlogRepository);
export const createEpicUsecase = new CreateEpicUsecase(backlogRepository);
export const createIssueUsecase = new CreateIssueUsecase(backlogRepository);
export const createSprintUsecase = new CreateSprintUsecase(backlogRepository);
export const getSprintsUsecase = new GetSprintsUseCase(backlogRepository);
export const getTasksUsecase = new GetTasksUseCase(backlogRepository);
export const assignIssueUsecase = new AssignIssueUseCase(backlogRepository);
export const dragDropUsecase = new DragDropUseCase(backlogRepository);
export const changeTaskStatusUsecase = new ChangeTaskStatus(backlogRepository);
export const startSprintUsecase = new StartSprintUsecase(backlogRepository);
export const isActiveSprint = new IsActiveSprintUsecase(backlogRepository);