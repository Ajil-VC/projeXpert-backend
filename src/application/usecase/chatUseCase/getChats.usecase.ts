import { IGetChatUsecase } from "../../../config/Dependency/user/chat.di";
import { IChatRepository } from "../../../domain/repositories/chat.repo";
import { PopulatedConversation } from "../../../infrastructure/database/models/conversation.interface";


export class GetChats implements IGetChatUsecase {

    constructor(private _chatRepo: IChatRepository) { }

    async execute(userId: string, companyId: string): Promise<PopulatedConversation[]> {

        const result = await this._chatRepo.getChats(userId, companyId);
        if (!result) {
            throw new Error('Couldnt findout the chats.');
        }

        return result;

    }

}