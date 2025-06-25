
import { TaskRepositoryImp } from "../../../infrastructure/repositories/task.repositoryImp";
import { ITaskRepository } from "../../../domain/repositories/task.repo";
import { UpdateTaskDetailsUsecase } from "../../../application/usecase/taskUsecase/updateTask.usecase";
import { CompleteSprintUsecase } from "../../../application/usecase/taskUsecase/completesprint.usecase";
import { ICloudinary } from "../../../domain/services/cloudinary.interface";
import { CloudUploadService } from "../../../infrastructure/services/cloud-upload.serviceImp";
import { DeleteAttachmentUsecase } from "../../../application/usecase/taskUsecase/deleteAttachment.usecase";

const cloudinarySer: ICloudinary = new CloudUploadService()
const taskRepository: ITaskRepository = new TaskRepositoryImp();
export const updateTaskDetailsUse = new UpdateTaskDetailsUsecase(taskRepository, cloudinarySer);
export const completeSprintUse = new CompleteSprintUsecase(taskRepository);
export const removeAttachment = new DeleteAttachmentUsecase(taskRepository, cloudinarySer);