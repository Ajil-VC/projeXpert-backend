import { IDeleteMeetingUsecase } from "../../../config/Dependency/user/groupcall.di";
import { IMeetingRepository } from "../../../domain/repositories/meeting.repo";




export class RemoveMeetingUsecase implements IDeleteMeetingUsecase {

    constructor(private _meetRepo: IMeetingRepository) { }

    async execute(meetId: string): Promise<boolean> {

        const result = await this._meetRepo.removeMeeting(meetId);
        return result;
    }
}