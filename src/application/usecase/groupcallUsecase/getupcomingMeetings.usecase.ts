import { IMeetingRepository } from "../../../domain/repositories/meeting.repo";
import { Meeting } from "../../../infrastructure/database/models/meeting.interface";





export class GetUpcomingMeetingsUsecase {

    constructor(private MeetingRepo: IMeetingRepository) { }

    async execute(companyId: string, userId: string): Promise<Meeting[]> {

        const meetings = await this.MeetingRepo.getUpcomingMeetings(companyId, userId);
        return meetings;
    }
}