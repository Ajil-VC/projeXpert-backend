import { Request, Response, NextFunction } from "express";
import { IGroupcallController } from "../../interfaces/user/groupCall.controller.usecase";
import { ICreateMeetingUsecase, IDeleteMeetingUsecase, IGenerateRoomIdUsecase, IUpcomingMeetingUsecase } from "../../config/Dependency/user/groupcall.di";
import { config } from "../../config/config";
import { HttpStatusCode } from "../../config/http-status.enum";
import { IGenerateKitToken } from "../../domain/services/generateKitToken.interface";
import { ICreateNotificationUsecase } from "../../config/Dependency/user/notification.di";
import { getUserSocket } from "../../infrastructure/services/socket.manager";
import { getIO } from "../../config/socket";


export class GroupcallController implements IGroupcallController {


    constructor(
        private _genToken: IGenerateKitToken,
        private _generateRoomId: IGenerateRoomIdUsecase,
        private _createMeeting: ICreateMeetingUsecase,
        private _notification: ICreateNotificationUsecase,
        private _upcomingMeetings: IUpcomingMeetingUsecase,
        private _deletemeeting: IDeleteMeetingUsecase
    ) { }


    removeMeeting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const meetId = req.query.meetId;
            if (!meetId || typeof meetId !== 'string') {
                throw new Error('Need meet Id ');
            }
            const result = await this._deletemeeting.execute(meetId);
            if (!result) {
                res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: 'Couldnt remove the meeting' });
                return;
            }

            res.status(HttpStatusCode.OK).json({ status: true });
            return;

        } catch (err) {
            next(err);
        }
    }


    getUpcomingMeetings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const page = req.query.page_num;
            const searchTerm = typeof req.query.searchTerm !== 'string' || req.query.searchTerm === 'undefined' ? ''
                : req.query.searchTerm;

            const pageNum =
                typeof page === "string"
                    ? parseInt(page)
                    : 1;
            const limit = 3;
            const skip = (pageNum - 1) * limit;

            const result = await this._upcomingMeetings.execute(req.user.companyId, req.user.id, limit, skip, searchTerm);
            res.status(HttpStatusCode.OK).json({ status: true, meetings: result.upcomingMeetings, totalPages: result.totalPages });
            return;

        } catch (err) {
            next(err);
        }

    }


    createRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const io = getIO();

            const createdMeeting = await this._createMeeting.execute(
                req.user.companyId,
                req.user.id,
                req.body.roomName,
                req.body.meetingDate,
                req.body.meetingTime,
                req.body.description,
                req.body.members,
                req.body.roomId,
                req.body.url,
                req.body.recurring,
                req.body.days || []
            );

            if (createdMeeting) {
                const sendNotificationPromises = req.body.members.map((member: string) => {
                    return this._notification.execute(req.user.id, member, 'message', 'New meeting scheduled', req.body.url);
                });

                const notificationResults = await Promise.allSettled(sendNotificationPromises);

                notificationResults.forEach((result) => {
                    if (result.status === 'fulfilled') {
                        const notify = result.value;
                        const assigneeSocketId = getUserSocket(notify.receiverId as string);
                        if (assigneeSocketId) {
                            io.to(assigneeSocketId).emit('notification', notify);
                        }
                    } else {
                        console.error('Notification failed:', result.reason);
                    }
                });

            }


            res.status(HttpStatusCode.CREATED).json({ status: true, createdMeeting });
            return;

        } catch (err) {
            next(err);
        }
    }

    getCallToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const roomId = await this._generateRoomId.execute();
            const payload = JSON.stringify({ room_id: roomId });

            if (!config.ZEGO_APP_ID || !config.ZEGO_SERVER_SECRET) {
                res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: 'Couldnt create zego token' });
                return;
            }
            const token = this._genToken.generateKitTokenForRoom(Number(config.ZEGO_APP_ID), req.user.id, config.ZEGO_SERVER_SECRET, 3600, payload);
            res.status(HttpStatusCode.CREATED).json({ token, roomId });

        } catch (err) {
            next(err);
        }
    }


}