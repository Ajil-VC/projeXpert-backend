

export interface IChatRepository {

    startConversation(recieverId: string, senderId: string, projectId: string): Promise<any>;

    getChats(userId: string, projectId: string): Promise<any>;

    getMessages(convoId: string): Promise<any>;

    sendMessage(projecId: string, convoId: string, senderId: string, recieverId: string, message: string): Promise<any>;
}