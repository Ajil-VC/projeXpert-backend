import { IChatRepository } from "../../../domain/repositories/chat.repo";
import { Message } from "../../../infrastructure/database/models/message.interface";


export class GetMessagesUseCase {

    constructor(private chatRepo: IChatRepository) { }

    async execute(convoId: string): Promise<Array<Message>> {

        const result = await this.chatRepo.getMessages(convoId);

        if (!result) {
            throw new Error('Messages couldnt retrieve.');
        }


        return result;
    }
}