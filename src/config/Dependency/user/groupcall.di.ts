
import { Meeting } from "../../../infrastructure/database/models/meeting.interface";


export interface IGenerateRoomIdUsecase {
    execute(): Promise<string>;
}

export interface ICreateMeetingUsecase {
    execute(
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
    ): Promise<Meeting>
}

export interface IUpcomingMeetingUsecase {
    execute(companyId: string, userId: string, limit: number, skip: number, searchTerm: string): Promise<{ upcomingMeetings: Array<Meeting>, totalPages: number }>
}

export interface IDeleteMeetingUsecase {
    execute(meetId: string): Promise<boolean>;
}