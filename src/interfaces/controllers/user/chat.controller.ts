import { Request, Response } from "express";
import { ChatUseCase } from "../../../application/usecase/chatUseCase/startConversation.usecase";
import { ChatRepositoryImp } from "../../../infrastructure/repositories/chat.repositoryImp";
import { GetChats } from "../../../application/usecase/chatUseCase/getChats.usecase";
import { GetMessagesUseCase } from "../../../application/usecase/chatUseCase/getMessages.usecase";
import { SendMessageUsecase } from "../../../application/usecase/chatUseCase/sendMessage.usecase";

import { getUserSocket, getAllUsers } from "../../../infrastructure/services/socket.manager";
import { getIO } from "../../../config/socket";

const chatRepoImp = new ChatRepositoryImp();
const chatUseCaseOb = new ChatUseCase(chatRepoImp);
const getChatsUseCaseOb = new GetChats(chatRepoImp);
const getMessagesUsecaseOb = new GetMessagesUseCase(chatRepoImp);
const sendMessageUsecaseOb = new SendMessageUsecase(chatRepoImp);

export const startConversation = async (req: Request, res: Response): Promise<void> => {

    try {

        const { userId, projectId } = req.body;

        if (typeof userId !== 'string' || typeof projectId !== 'string') {
            throw new Error('userId or projectId is not valid string');
        }

        if (userId === req.user.id) {
            res.status(400).json({ status: false, message: 'same user id' });
            return;
        }

        const result = await chatUseCaseOb.execute(userId, req.user.id, projectId);
        if (!result) {
            throw new Error('Couldnt start the conversation.');
        }

        res.status(201).json({ status: true, message: 'Conversation started', result });
        return;

    } catch (err) {

        console.error('Something went wrong while starting conversation.', err);
        res.status(500).json({ status: false, message: 'Something went wrong while starting conversation' });

    }

}

export const getChats = async (req: Request, res: Response): Promise<void> => {
    try {

        const result = await getChatsUseCaseOb.execute(req.user.id, req.params.projectId);

        if (!result) {
            throw new Error('Couldnt retrieve the chats.');
        }

        res.status(200).json({ status: true, message: 'Chats fetched', result });
        return;

    } catch (err) {
        console.error('Something went wrong while retrieving chats.', err);
        res.status(500).json({ status: false, message: 'Something went wrong while retrieving chats' });

    }
}


export const getMessages = async (req: Request, res: Response): Promise<void> => {

    try {

        const result = await getMessagesUsecaseOb.execute(req.params.convoId);
        if (!result) {
            throw new Error('Couldnt retrieve the messages.');
        }

        res.status(200).json({ status: true, message: 'Data retrieved', result });
        return;

    } catch (err) {
        console.error('Something went wrong while retrieving messages.', err);
        res.status(500).json({ status: false, message: 'Something went wrong while retrieving messages' });

    }
}

export const sendMessage = async (req: Request, res: Response): Promise<void> => {

    try {

        const io = getIO();

        const { projecId, convoId, recieverId, message } = req.body;
        const result = await sendMessageUsecaseOb.execute(projecId, convoId, req.user.id, recieverId, message);

        if (!result) {
            throw new Error('Couldnt send the message.');
        }

        const recieverSocketId = getUserSocket(recieverId);
        if(recieverSocketId){
            io.to(recieverSocketId).emit('receive-message',result)
        }

        res.status(201).json({ status: true, message: 'Message sent', result });
        return;

    } catch (err) {
        console.error('Something went wrong while sending message.', err);
        res.status(500).json({ status: false, message: 'Something went wrong while sending message' });

    }
}