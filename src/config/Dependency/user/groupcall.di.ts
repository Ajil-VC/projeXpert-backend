import { CreateMeetingUsecase } from "../../../application/usecase/groupcallUsecase/createMeeting.usecase";
import { GenerateRoomIdUsecase } from "../../../application/usecase/groupcallUsecase/getroomId.usecase";
import { GetUpcomingMeetingsUsecase } from "../../../application/usecase/groupcallUsecase/getupcomingMeetings.usecase";
import { RemoveMeetingUsecase } from "../../../application/usecase/groupcallUsecase/removeMeeting.usecase";
import { IMeetingRepository } from "../../../domain/repositories/meeting.repo";
import { Meeting } from "../../../infrastructure/database/models/meeting.interface";
import { MeetingRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/meeting.repositoryImp";


export interface IGenerateRoomId {
    execute(): Promise<string>;
}

export interface ICreateMeeting {
    execute(
        companyId: string,
        userId: string,
        roomName: string,
        meetingDate: string,
        meetingTime: string,
        description: string,
        members: [string],
        roomId: string,
        url: string): Promise<Meeting>
}

export interface IUpcomingMeeting {
    execute(companyId: string, userId: string): Promise<Meeting[]>
}

export interface IDeleteMeeting {
    execute(meetId: string): Promise<boolean>;
}