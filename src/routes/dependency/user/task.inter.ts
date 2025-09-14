import { AddCommentUseCase } from "../../../application/usecase/taskUsecase/addComment.usecase";
import { CompleteSprintUsecase } from "../../../application/usecase/taskUsecase/completesprint.usecase";
import { DeleteAttachmentUsecase } from "../../../application/usecase/taskUsecase/deleteAttachment.usecase";
import { EpicProgressUsecase } from "../../../application/usecase/taskUsecase/epicprogress.usecase";
import { GetCommentsUseCase } from "../../../application/usecase/taskUsecase/getComment.usecase";
import { UpdateTaskDetailsUsecase } from "../../../application/usecase/taskUsecase/updateTask.usecase";
import { IGetCommentsUsecase } from "../../../config/Dependency/user/task.di";
import { ITaskRepository } from "../../../domain/repositories/task.repo";
import { ICloudinary } from "../../../domain/services/cloudinary.interface";
import { TaskRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/task.repositoryImp";
import { CloudUploadService } from "../../../infrastructure/services/cloud-upload.serviceImp";


const cloudinarySer: ICloudinary = new CloudUploadService()
const taskRepository: ITaskRepository = new TaskRepositoryImp();

export const updateTaskDetailsUse = new UpdateTaskDetailsUsecase(taskRepository, cloudinarySer);
export const removeAttachment = new DeleteAttachmentUsecase(taskRepository, cloudinarySer);
export const completeSprintUse = new CompleteSprintUsecase(taskRepository);
export const getCommentsUse: IGetCommentsUsecase = new GetCommentsUseCase(taskRepository);
export const addCommentUse = new AddCommentUseCase(taskRepository);
export const epicProgress = new EpicProgressUsecase(taskRepository);