
import { SaveVideoCallUsecase } from "../../../application/usecase/chatUseCase/saveVideocallRecord.usecase";
import { Message } from "../../../infrastructure/database/models/message.interface";


export interface IChat {
    execute(userId: string, currentUserId: string, companyId: string): Promise<any>;
}

export interface IGetChat {
    execute(userId: string, companyId: string): Promise<any>;
}

export interface IGetMessages {
    execute(convoId: string): Promise<Array<Message>>;
}

export interface ISendMessages {
    execute(convoId: string, senderId: string, recieverId: string, message: string): Promise<any>;
}