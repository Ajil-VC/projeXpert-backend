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
        recurring: boolean,
        days: Array<string>
    ): Promise<Meeting>;


    getUpcomingMeetings(companyId: string, userId: string, limit: number, skip: number, searchTerm: string): Promise<{ upcomingMeetings: Array<Meeting>, totalPages: number }>;

    removeMeeting(meetId: string): Promise<boolean>;
}