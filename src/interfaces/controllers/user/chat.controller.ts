import { Request, Response } from "express";

import { chatUsecase } from "../../../config/Dependency/user/chat.di";
import { getChatsUsecase } from "../../../config/Dependency/user/chat.di";
import { getMessagesUsecase } from "../../../config/Dependency/user/chat.di";
import { sendMessagesUsecase } from "../../../config/Dependency/user/chat.di";

import { getUserSocket } from "../../../infrastructure/services/socket.manager";
import { getIO } from "../../../config/socket";
import { notification } from "../../../config/Dependency/user/notification.di";


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

        const result = await chatUsecase.execute(userId, req.user.id, projectId);
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

        const result = await getChatsUsecase.execute(req.user.id, req.params.projectId);

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

        const result = await getMessagesUsecase.execute(req.params.convoId);
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
        const result = await sendMessagesUsecase.execute(projecId, convoId, req.user.id, recieverId, message);
        const createdNotification = await notification.execute(req.user.id, recieverId, 'message', `You got a message from ${req.user.email}`, '');

        if (!result) {
            throw new Error('Couldnt send the message.');
        }
        
        const recieverSocketId = getUserSocket(recieverId);
        const senderSocketId = getUserSocket(req.user.id);
        if (recieverSocketId && senderSocketId) {
            io.to(recieverSocketId).emit('receive-message', result);
            io.to(senderSocketId).emit('receive-message', result);
            io.to(recieverSocketId).emit('notification', createdNotification);
        }

        res.status(201).json({ status: true, message: 'Message sent', result });
        return;

    } catch (err) {
        console.error('Something went wrong while sending message.', err);
        res.status(500).json({ status: false, message: 'Something went wrong while sending message' });

    }
}