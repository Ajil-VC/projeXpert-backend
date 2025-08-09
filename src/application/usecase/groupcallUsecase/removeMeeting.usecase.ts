import { IMeetingRepository } from "../../../domain/repositories/meeting.repo";




export class RemoveMeetingUsecase {

    constructor(private meetRepo: IMeetingRepository) { }

    async execute(meetId: string): Promise<boolean> {

        const result = await this.meetRepo.removeMeeting(meetId);
        return result;
    }
}