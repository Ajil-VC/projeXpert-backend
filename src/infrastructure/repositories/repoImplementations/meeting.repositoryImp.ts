import mongoose from "mongoose";
import { IMeetingRepository } from "../../../domain/repositories/meeting.repo";
import { Meeting } from "../../database/models/meeting.interface";
import MeetingModel from "../../database/meeting.model";



export class MeetingRepositoryImp implements IMeetingRepository {


    async removeMeeting(meetId: string): Promise<boolean> {

        const meetOb = new mongoose.Types.ObjectId(meetId);
        const result = await MeetingModel.deleteOne({ _id: meetOb });
        if (!result.acknowledged) {
            return false;
        }

        return true;
    }


    async getUpcomingMeetings(companyId: string, userId: string): Promise<Array<Meeting>> {

        const companyOb = new mongoose.Types.ObjectId(companyId);
        const userOb = new mongoose.Types.ObjectId(userId);

        const upcomingMeetings = await MeetingModel.find({
            companyId: companyOb,
            $or: [
                { members: { $in: [userOb] } },
                { createdBy: userOb }
            ]
        })
            .populate({
                path: 'members',
                select: '_id name email profilePicUrl role createdAt updatedAt'
            })
            .populate({
                path: 'createdBy',
                select: '_id name email profilePicUrl role createdAt updatedAt'
            }).sort({ recurring: -1 });


        if (!upcomingMeetings) {

            throw new Error("No upcoming meetings avaialalble.");
        }

        return upcomingMeetings;

    }


    async createMeeting(companyId: string,
        userId: string, roomName: string, meetingDate: string, meetingTime: string, description: string, members: [string], roomId: string, url: string, recurring: boolean): Promise<Meeting> {

        const companyOb = new mongoose.Types.ObjectId(companyId);
        const userOb = new mongoose.Types.ObjectId(userId);

        const newMeetingDate = recurring ? null : new Date(meetingDate);

        const newMeeting = new MeetingModel({
            companyId: companyOb,
            roomName,
            meetingDate: newMeetingDate,
            meetingTime,
            recurring,
            description,
            members: members.map(member => new mongoose.Types.ObjectId(member)),
            status: 'upcoming',
            createdBy: userOb,
            url,
            roomId
        });

        const createdMeeting = await newMeeting.save();
        if (!this.createMeeting) throw new Error('Couldnt create meeting.');

        const populatedMeeting = await MeetingModel.findById(createdMeeting._id)
            .populate({
                path: 'members',
                select: '_id name email profilePicUrl role createdAt updatedAt'
            })
            .populate({
                path: 'createdBy',
                select: '_id name email profilePicUrl role createdAt updatedAt'
            });

        return populatedMeeting;

    }


}