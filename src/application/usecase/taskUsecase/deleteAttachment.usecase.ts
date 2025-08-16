import { IRemoveAttachment } from "../../../config/Dependency/user/task.di";
import { ITaskRepository } from "../../../domain/repositories/task.repo";
import { ICloudinary } from "../../../domain/services/cloudinary.interface";
import { Task } from "../../../infrastructure/database/models/task.interface";


export class DeleteAttachmentUsecase implements IRemoveAttachment {

    constructor(private taskRepo: ITaskRepository, private cloudinary: ICloudinary) { }

    async execute(publicId: string, taskId: string): Promise<Task> {

        const cloudResult = await this.cloudinary.deleteImage(publicId);
        if (cloudResult.result !== 'ok') {
            throw new Error('Couldnt remove image from cloudinary.');
        }

        const updatedTask = await this.taskRepo.removeAttachment(publicId, taskId);
        return updatedTask;
    }
}