import { CreateMeetingUsecase } from "../../../application/usecase/groupcallUsecase/createMeeting.usecase";
import { GenerateRoomIdUsecase } from "../../../application/usecase/groupcallUsecase/getroomId.usecase";
import { GetUpcomingMeetingsUsecase } from "../../../application/usecase/groupcallUsecase/getupcomingMeetings.usecase";
import { RemoveMeetingUsecase } from "../../../application/usecase/groupcallUsecase/removeMeeting.usecase";
import { IMeetingRepository } from "../../../domain/repositories/meeting.repo";
import { MeetingRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/meeting.repositoryImp";

const meetRepository: IMeetingRepository = new MeetingRepositoryImp();

export const generateRoomId = new GenerateRoomIdUsecase();
export const createMeeting = new CreateMeetingUsecase(meetRepository);
export const upcomingMeetings = new GetUpcomingMeetingsUsecase(meetRepository);
export const deletemeeting = new RemoveMeetingUsecase(meetRepository);