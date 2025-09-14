
import { SaveVideoCallUsecase } from "../../../application/usecase/chatUseCase/saveVideocallRecord.usecase";
import { Message } from "../../../infrastructure/database/models/message.interface";


export interface IChatUsecase {
    execute(userId: string, currentUserId: string, companyId: string): Promise<any>;
}

export interface IGetChatUsecase {
    execute(userId: string, companyId: string): Promise<any>;
}

export interface IGetMessagesUsecase {
    execute(convoId: string): Promise<Array<Message>>;
}

export interface ISendMessagesUsecase {
    execute(convoId: string, senderId: string, recieverId: string, message: string): Promise<any>;
}