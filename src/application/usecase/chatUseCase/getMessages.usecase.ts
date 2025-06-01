import { IChatRepository } from "../../../domain/repositories/chat.repo";


export class GetMessagesUseCase {

    constructor(private chatRepo: IChatRepository) { }

    async execute(convoId: string): Promise<any> {

        const result = await this.chatRepo.getMessages(convoId);

        if (!result) {
            throw new Error('Messages couldnt retrieve.');
        }

        return result;
    }
}