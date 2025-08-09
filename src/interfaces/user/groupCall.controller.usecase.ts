import { NextFunction, Request, Response } from "express";


export interface IGroupcallController {

    getCallToken(req: Request, res: Response, next: NextFunction): Promise<void>;

    createRoom(req: Request, res: Response, next: NextFunction): Promise<void>;

    getUpcomingMeetings(req: Request, res: Response, next: NextFunction): Promise<void>;

    removeMeeting(req: Request, res: Response, next: NextFunction): Promise<void>;
}