import { IChatRepository } from "../../../domain/repositories/chat.repo";


export class ChatUseCase {

    constructor(private chatRepo: IChatRepository) { }

    async execute(userId: string, currentUserId: string, companyId: string): Promise<any> {

        const result = await this.chatRepo.startConversation(userId, currentUserId, companyId);

        if (!result) {
            throw new Error('Couldnt create new conversation.');
        }

        return result;

    }
}