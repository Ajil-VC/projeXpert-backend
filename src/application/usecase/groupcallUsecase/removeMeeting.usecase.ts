import { IDeleteMeeting } from "../../../config/Dependency/user/groupcall.di";
import { IMeetingRepository } from "../../../domain/repositories/meeting.repo";




export class RemoveMeetingUsecase implements IDeleteMeeting {

    constructor(private meetRepo: IMeetingRepository) { }

    async execute(meetId: string): Promise<boolean> {

        const result = await this.meetRepo.removeMeeting(meetId);
        return result;
    }
}