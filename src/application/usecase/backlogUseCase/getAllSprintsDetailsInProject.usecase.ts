import { IGetAllSprintsDetailsInProject } from "../../../config/Dependency/user/backlog.di";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import { Sprint } from "../../../infrastructure/database/models/sprint.interface";




export class GetAllSprintsDetailsInProjectUsecase implements IGetAllSprintsDetailsInProject {

    constructor(private _backlogRepo: IBacklogRepository) { }

    async execute(projectId: string): Promise<Array<Sprint>> {

        const sprints = await this._backlogRepo.getAllSprintsDetailsInProject(projectId);
        return sprints;
    }
}