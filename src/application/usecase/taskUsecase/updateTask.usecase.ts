import { Task } from "../../../infrastructure/database/models/task.interface";
import { ITaskRepository } from "../../../domain/repositories/task.repo";
import { ICloudinary } from "../../../domain/services/cloudinary.interface";
import { IUpdateTaskDetails } from "../../../config/Dependency/user/task.di";


export class UpdateTaskDetailsUsecase implements IUpdateTaskDetails {

    constructor(private taskRepo: ITaskRepository, private cloudinary: ICloudinary) { }

    async execute(task: Task, assigneeId: string, files: Express.Multer.File[]): Promise<Task> {


        const uploadedFiles = await Promise.all(
            files.map(file => this.cloudinary.uploadImage(file, 'tasks'))
        );

        task.attachments = uploadedFiles;

        const updatedTask = await this.taskRepo.updateTaskDetails(task, assigneeId);
        if (!updatedTask) {
            throw new Error('Couldnt update task');
        }

        return updatedTask;
    }
}