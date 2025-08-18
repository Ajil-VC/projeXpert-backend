import { Meeting } from "../../infrastructure/database/models/meeting.interface";



export interface IMeetingRepository {

    createMeeting(
        companyId: string,
        userId: string,
        roomName: string,
        meetingDate: string,
        meetingTime: string,
        description: string,
        members: [string],
        roomId: string,
        url: string,
        recurring: boolean
    ): Promise<Meeting>;


    getUpcomingMeetings(companyId: string, userId: string): Promise<Array<Meeting>>;

    removeMeeting(meetId: string): Promise<boolean>;
}