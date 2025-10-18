import { ISendMessagesUsecase } from "../../../config/Dependency/user/chat.di";
import { IChatRepository } from "../../../domain/repositories/chat.repo";
import { Message } from "../../../infrastructure/database/models/message.interface";


export class SendMessageUsecase implements ISendMessagesUsecase {
    constructor(private _chatRepo: IChatRepository) { }

    async execute(convoId: string, senderId: string, recieverId: string, message: string): Promise<Message> {

        const result = await this._chatRepo.sendMessage(convoId, senderId, recieverId, message);
        if (!result) {
            throw new Error('Couldnt save the message.');
        }

        return result;
    }
}