import { IChatRepository } from "../../../domain/repositories/chat.repo";


export class SendMessageUsecase {
    constructor(private chatRepo: IChatRepository) { }

    async execute(projectId: string, convoId: string, senderId: string, recieverId: string, message: string): Promise<any> {

        const result = await this.chatRepo.sendMessage(projectId, convoId, senderId, recieverId, message);
        if(!result){
            throw new Error('Couldnt save the message.');
        }

        return result;
    }
}