import { Request, Response, NextFunction } from "express";
import { IGroupcallController } from "../../interfaces/user/groupCall.controller.usecase";
import { ICreateMeeting, IDeleteMeeting, IGenerateRoomId, IUpcomingMeeting } from "../../config/Dependency/user/groupcall.di";
import { config } from "../../config/config";
import { HttpStatusCode } from "../../config/http-status.enum";
import { IGenerateKitToken } from "../../domain/services/generateKitToken.interface";
import { ICreateNotification } from "../../config/Dependency/user/notification.di";
import { getUserSocket } from "../../infrastructure/services/socket.manager";
import { getIO } from "../../config/socket";


export class GroupcallController implements IGroupcallController {


    constructor(
        private genToken: IGenerateKitToken,
        private generateRoomId: IGenerateRoomId,
        private createMeeting: ICreateMeeting,
        private notification: ICreateNotification,
        private upcomingMeetings: IUpcomingMeeting,
        private deletemeeting: IDeleteMeeting
    ) { }


    removeMeeting = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const meetId = req.query.meetId;
            if (!meetId || typeof meetId !== 'string') {
                throw new Error('Need meet Id ');
            }
            const result = await this.deletemeeting.execute(meetId);
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

            const meetings = await this.upcomingMeetings.execute(req.user.companyId, req.user.id);
            res.status(HttpStatusCode.OK).json({ status: true, data: meetings });
            return;

        } catch (err) {
            next(err);
        }

    }


    createRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {

            const io = getIO();

            const createdMeeting = await this.createMeeting.execute(
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
                    return this.notification.execute(req.user.id, member, 'message', 'New meeting scheduled', req.body.url);
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

            const roomId = await this.generateRoomId.execute();
            const payload = JSON.stringify({ room_id: roomId });

            if (!config.ZEGO_APP_ID || !config.ZEGO_SERVER_SECRET) {
                res.status(HttpStatusCode.NOT_FOUND).json({ status: false, message: 'Couldnt create zego token' });
                return;
            }
            const token = this.genToken.generateKitTokenForRoom(Number(config.ZEGO_APP_ID), req.user.id, config.ZEGO_SERVER_SECRET, 3600, payload);
            res.status(HttpStatusCode.CREATED).json({ token, roomId });

        } catch (err) {
            next(err);
        }
    }


}