import { NextFunction, Request, Response } from "express";


export interface IChatController {

    startConversation(req: Request, res: Response, next: NextFunction): Promise<void>;

    getChats(req: Request, res: Response, next: NextFunction): Promise<void>;

    getMessages(req: Request, res: Response, next: NextFunction): Promise<void>;

    sendMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
}