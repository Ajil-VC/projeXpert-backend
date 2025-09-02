import { IUpcomingMeeting } from "../../../config/Dependency/user/groupcall.di";
import { IMeetingRepository } from "../../../domain/repositories/meeting.repo";
import { Meeting } from "../../../infrastructure/database/models/meeting.interface";





export class GetUpcomingMeetingsUsecase implements IUpcomingMeeting {

    constructor(private MeetingRepo: IMeetingRepository) { }

    async execute(companyId: string, userId: string, limit: number, skip: number, searchTerm: string): Promise<{ upcomingMeetings: Array<Meeting>, totalPages: number }> {

        const meetings = await this.MeetingRepo.getUpcomingMeetings(companyId, userId, limit, skip, searchTerm);
        return meetings;
    }
}