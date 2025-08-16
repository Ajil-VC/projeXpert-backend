import { IGetChat } from "../../../config/Dependency/user/chat.di";
import { IChatRepository } from "../../../domain/repositories/chat.repo";


export class GetChats implements IGetChat {

    constructor(private chatRepo: IChatRepository) { }

    async execute(userId: string, companyId: string): Promise<any> {

        const result = await this.chatRepo.getChats(userId, companyId);
        if (!result) {
            throw new Error('Couldnt findout the chats.');
        }
        
        return result;

    }
    
}