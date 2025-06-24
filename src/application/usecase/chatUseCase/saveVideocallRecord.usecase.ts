import { IChatRepository } from "../../../domain/repositories/chat.repo";
import { Message } from "../../../infrastructure/database/models/message.interface";




export class SaveVideoCallUsecase {


    constructor(private chatRepo: IChatRepository) { }
    async execute(projectId: string, convoId: string, senderId: string, recieverId: string, type: string, msgId: string | null): Promise<Message | null> {

        try {
            
            const result = await this.chatRepo.saveVideoCallRecord(projectId, convoId, senderId, recieverId, type, msgId);
            return result;
        } catch (err) {
            console.error('Couldnt save the video call record.');
            return null;
        }
    }
}