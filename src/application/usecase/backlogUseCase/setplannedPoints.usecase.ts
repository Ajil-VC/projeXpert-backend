import { ISprintPointsCalculationUsecase } from "../../../config/Dependency/user/backlog.di";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";

export class SprintPointsCalculationUsecase implements ISprintPointsCalculationUsecase {
    constructor(private _backlogRepo: IBacklogRepository) { }

    async execute(sprintId: string): Promise<boolean> {

        const result = await this._backlogRepo.calculatePointsInSprint(sprintId);
        return result;
    }
}