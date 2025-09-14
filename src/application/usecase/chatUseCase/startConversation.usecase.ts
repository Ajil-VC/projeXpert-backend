import { IChatUsecase } from "../../../config/Dependency/user/chat.di";
import { IChatRepository } from "../../../domain/repositories/chat.repo";


export class ChatUseCase implements IChatUsecase {

    constructor(private _chatRepo: IChatRepository) { }

    async execute(userId: string, currentUserId: string, companyId: string): Promise<any> {

        const result = await this._chatRepo.startConversation(userId, currentUserId, companyId);

        if (!result) {
            throw new Error('Couldnt create new conversation.');
        }

        return result;

    }
}