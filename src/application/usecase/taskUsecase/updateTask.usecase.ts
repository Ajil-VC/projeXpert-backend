import { Task } from "../../../infrastructure/database/models/task.interface";
import { ITaskRepository } from "../../../domain/repositories/task.repo";
import { ICloudinary } from "../../../domain/services/cloudinary.interface";
import { IUpdateTaskDetailsUsecase } from "../../../config/Dependency/user/task.di";


export class UpdateTaskDetailsUsecase implements IUpdateTaskDetailsUsecase {

    constructor(private _taskRepo: ITaskRepository, private _cloudinary: ICloudinary) { }

    async execute(task: Task, assigneeId: string, files: Express.Multer.File[]): Promise<Task> {


        const uploadedFiles = await Promise.all(
            files.map(file => this._cloudinary.uploadImage(file, 'tasks'))
        );

        task.attachments = uploadedFiles;

        const updatedTask = await this._taskRepo.updateTaskDetails(task, assigneeId);
        if (!updatedTask) {
            throw new Error('Couldnt update task');
        }

        return updatedTask;
    }
}