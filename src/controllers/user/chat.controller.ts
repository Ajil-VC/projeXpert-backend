import { NextFunction, Request, Response } from "express";

import { IChatUsecase, IGetChatUsecase, IGetMessagesUsecase, ISendMessagesUsecase } from "../../config/Dependency/user/chat.di";


import { getUserSocket } from "../../infrastructure/services/socket.manager";
import { getIO } from "../../config/socket";

import { HttpStatusCode } from "../../config/http-status.enum";
import { IChatController } from "../../interfaces/user/chat.controller.interface";

import { ICreateNotificationUsecase } from "../../config/Dependency/user/notification.di";


export class ChatController implements IChatController {

    constructor(
        private _notification: ICreateNotificationUsecase,
        private _chatUsecase: IChatUsecase,
        private _getChatsUsecase: IGetChatUsecase,
        private _getMessagesUsecase: IGetMessagesUsecase,
        private _sendMessagesUsecase: ISendMessagesUsecase
    ) { }

    startConversation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const { userId } = req.body;

            if (typeof userId !== 'string') {
                throw new Error('userId is not valid string');
            }

            if (userId === req.user.id) {
                res.status(HttpStatusCode.BAD_REQUEST).json({ status: false, message: 'same user id' });
                return;
            }

            const result = await this._chatUsecase.execute(userId, req.user.id, req.user.companyId);

            res.status(HttpStatusCode.CREATED).json({ status: true, message: 'Conversation started', result });
            return;

        } catch (err) {

            next(err);
        }

    }


    getChats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const result = await this._getChatsUsecase.execute(req.user.id, req.user.companyId);

            res.status(HttpStatusCode.OK).json({ status: true, message: 'Chats fetched', result });
            return;

        } catch (err) {
            next(err);
        }
    }


    getMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const result = await this._getMessagesUsecase.execute(req.params.convoId);

            res.status(HttpStatusCode.OK).json({ status: true, message: 'Data retrieved', result });
            return;

        } catch (err) {
            next(err);
        }
    }


    sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const io = getIO();

            const { convoId, recieverId, message } = req.body;
            const result = await this._sendMessagesUsecase.execute(convoId, req.user.id, recieverId, message);
            const createdNotification = await this._notification.execute(req.user.id, recieverId, 'message', `You got a message from ${req.user.email}`, 'user/chat');

            const recieverSocketId = getUserSocket(recieverId);
            const senderSocketId = getUserSocket(req.user.id);
            if (recieverSocketId && senderSocketId) {
                io.to(recieverSocketId).emit('receive-message', result);
                io.to(senderSocketId).emit('receive-message', result);
                io.to(recieverSocketId).emit('notification', createdNotification);
            }

            res.status(HttpStatusCode.CREATED).json({ status: true, message: 'Message sent', result });
            return;

        } catch (err) {
            next(err);
        }
    }
}


