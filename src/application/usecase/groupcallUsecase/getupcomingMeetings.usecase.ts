import { IUpcomingMeetingUsecase } from "../../../config/Dependency/user/groupcall.di";
import { IMeetingRepository } from "../../../domain/repositories/meeting.repo";
import { Meeting } from "../../../infrastructure/database/models/meeting.interface";





export class GetUpcomingMeetingsUsecase implements IUpcomingMeetingUsecase {

    constructor(private _MeetingRepo: IMeetingRepository) { }

    async execute(companyId: string, userId: string, limit: number, skip: number, searchTerm: string): Promise<{ upcomingMeetings: Array<Meeting>, totalPages: number }> {

        const meetings = await this._MeetingRepo.getUpcomingMeetings(companyId, userId, limit, skip, searchTerm);
        return meetings;
    }
}