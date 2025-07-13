import { Conversation } from "../../infrastructure/database/models/conversation.interface";
import { Message } from "../../infrastructure/database/models/message.interface";


export interface IChatRepository {

    startConversation(recieverId: string, senderId: string, companyId: string): Promise<Conversation>;

    getChats(userId: string, companyId: string): Promise<Conversation[]>;

    getMessages(convoId: string): Promise<Message[]>;

    sendMessage(convoId: string, senderId: string, recieverId: string, message: string): Promise<Message>;

    saveVideoCallRecord(convoId: string, senderId: string, recieverId: string, type: string, msgId: string | null): Promise<Message | null>;
}