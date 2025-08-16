import { IDragDrop } from "../../../config/Dependency/user/backlog.di";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { Task } from "../../../infrastructure/database/models/task.interface";


export class DragDropUseCase implements IDragDrop {

    constructor(private backlogRepo: IBacklogRepository) { }

    async execute(prevContainerId: string, containerId: string, movedTaskId: string): Promise<Task> {

        const result = await this.backlogRepo.dragDropUpdation(prevContainerId, containerId, movedTaskId);
        if (!result) {
            throw new Error('Error occured while updating dragdrop');
        }
        
        return result;

    }
}