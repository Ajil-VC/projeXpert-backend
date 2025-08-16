import { CreateMeetingUsecase } from "../../../application/usecase/groupcallUsecase/createMeeting.usecase";
import { GenerateRoomIdUsecase } from "../../../application/usecase/groupcallUsecase/getroomId.usecase";
import { GetUpcomingMeetingsUsecase } from "../../../application/usecase/groupcallUsecase/getupcomingMeetings.usecase";
import { RemoveMeetingUsecase } from "../../../application/usecase/groupcallUsecase/removeMeeting.usecase";
import { GroupcallController } from "../../../controllers/user/groupCall.controller";
import { IMeetingRepository } from "../../../domain/repositories/meeting.repo";
import { IGenerateKitToken } from "../../../domain/services/generateKitToken.interface";
import { MeetingRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/meeting.repositoryImp";
import { GenerateKitTokenService } from "../../../infrastructure/services/generateKitToken.serviceImp";
import { notification } from "./notification.inter";

const meetRepository: IMeetingRepository = new MeetingRepositoryImp();


export const generateRoomId = new GenerateRoomIdUsecase();
export const createMeeting = new CreateMeetingUsecase(meetRepository);
export const upcomingMeetings = new GetUpcomingMeetingsUsecase(meetRepository);
export const deletemeeting = new RemoveMeetingUsecase(meetRepository);

export const zegTokenService: IGenerateKitToken = new GenerateKitTokenService();

export const groupCallInterface = new GroupcallController(
    zegTokenService,
    generateRoomId,
    createMeeting,
    notification,
    upcomingMeetings,
    deletemeeting
)