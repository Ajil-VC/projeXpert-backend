import { ICreateMeeting } from "../../../config/Dependency/user/groupcall.di";
import { IMeetingRepository } from "../../../domain/repositories/meeting.repo";
import { Meeting } from "../../../infrastructure/database/models/meeting.interface";



export class CreateMeetingUsecase implements ICreateMeeting {

    constructor(private meetRepo: IMeetingRepository) { }

    async execute(
        companyId: string,
        userId: string,
        roomName: string,
        meetingDate: string,
        meetingTime: string,
        description: string,
        members: [string],
        roomId: string,
        url: string,
        recurring: boolean,
        days: Array<string>
    ): Promise<Meeting> {

        const newMeeting = await this.meetRepo.createMeeting(companyId, userId, roomName, meetingDate, meetingTime, description, members, roomId, url, recurring, days);
        return newMeeting;

    }
}