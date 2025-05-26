import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";


export class DragDropUseCase {

    constructor(private backlogRepo: IBacklogRepository) { }

    async execute(prevContainerId: string, containerId: string, movedTaskId: string): Promise<any> {

        const result = await this.backlogRepo.dragDropUpdation(prevContainerId, containerId, movedTaskId);
        if (!result) {
            throw new Error('Error occured while updating dragdrop');
        }

        return result;

    }
}