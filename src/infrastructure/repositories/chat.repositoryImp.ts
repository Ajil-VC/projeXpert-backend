import mongoose from "mongoose";
import { IChatRepository } from "../../domain/repositories/chat.repo";
import conversationModel from "../database/conversation.models";
import messageModel from "../database/message.models";
import { Message } from "../database/models/message.interface";



export class ChatRepositoryImp implements IChatRepository {


    async saveVideoCallRecord(projectId: string, convoId: string, senderId: string, recieverId: string, type: string, msgId: string | null): Promise<Message | null> {

        const projectIdOb = new mongoose.Types.ObjectId(projectId);
        const convoIdOb = new mongoose.Types.ObjectId(convoId);
        const senderIdOb = new mongoose.Types.ObjectId(senderId);
        const recieverIdOb = new mongoose.Types.ObjectId(recieverId);

        if (type === 'offer') {
            const videoRecord = new messageModel({
                conversationId: convoIdOb,
                senderId: senderIdOb,
                receiverId: recieverIdOb,
                projectId: projectIdOb,
                message: 'Video call',
                type: "call",
                callStatus: "missed"
            });

            const newVideoRecord = await videoRecord.save();
            const conversation = await conversationModel.updateOne({ _id: convoIdOb },
                { $set: { lastActivityType: 'call', callStatus: 'missed', callerId: senderIdOb } });
            if (!newVideoRecord) {
                return null;
            }
            return newVideoRecord;
        } else if ((type === 'answer' || type === 'call-ended') && msgId !== null) {

            const callStat = type === 'answer' ? 'started' : 'ended';
            const msgIdOb = new mongoose.Types.ObjectId(msgId);
            const [result, conversation] = await Promise.all([
                messageModel.findOneAndUpdate(
                    { _id: msgIdOb },
                    { $set: { callStatus: callStat } },
                    { new: true }
                ),
                conversationModel.updateOne(
                    { _id: convoIdOb },
                    { $set: { lastActivityType: 'call', callStatus: callStat } }
                )
            ]);
            if (!result) {
                throw new Error('Message couldnt update.');
            }
            return result;
        }

        return null;
    }


    async sendMessage(projecId: string, convoId: string, senderId: string, recieverId: string, message: string): Promise<any> {

        const projectIdOb = new mongoose.Types.ObjectId(projecId);
        const convoIdOb = new mongoose.Types.ObjectId(convoId);
        const senderIdOb = new mongoose.Types.ObjectId(senderId);
        const recieverIdOb = new mongoose.Types.ObjectId(recieverId);

        const newMessage = new messageModel({
            conversationId: convoIdOb,
            senderId: senderIdOb,
            receiverId: recieverIdOb,
            projectId: projectIdOb,
            message: message
        });

        const savedMessage = await newMessage.save();

        if (!savedMessage) {
            throw new Error('Couldnt save the message.');
        }

        await conversationModel.updateOne({ _id: convoIdOb }, { $set: { lastMessage: message, lastActivityType: 'msg', callerId: senderIdOb } });

        return savedMessage;

    }


    async getMessages(convoId: string): Promise<any> {

        const convoIdOb = new mongoose.Types.ObjectId(convoId);
        const retrievedMessages = await messageModel.find({
            conversationId: convoIdOb
        }).sort({ createdAt: 1 });

        if (!retrievedMessages) {
            throw new Error('Messages couldnt retrieve.');
        }

        return retrievedMessages;
    }


    async getChats(userId: string, projectId: string): Promise<any> {

        const userIdOb = new mongoose.Types.ObjectId(userId);
        const projectIdOb = new mongoose.Types.ObjectId(projectId);

        const availableChats = await conversationModel.find({
            participants: userIdOb,
            projectId: projectIdOb
        }).populate({ path: 'participants', select: '_id name email profilePicUrl role createdAt updatedAt' });

        if (!availableChats) {
            throw new Error('Couldnt findout the chats.');
        }

        return availableChats;

    }

    async startConversation(recieverId: string, senderId: string, projectId: string): Promise<any> {

        const senderIdOb = new mongoose.Types.ObjectId(senderId);
        const recieverIdOb = new mongoose.Types.ObjectId(recieverId);
        const projectIdOb = new mongoose.Types.ObjectId(projectId);

        const newConversation = new conversationModel({
            participants: [senderId, recieverIdOb],
            projectId: projectIdOb
        });

        const isConvoExists = await conversationModel.findOne({
            participants: { $all: [senderIdOb, recieverIdOb] },
            projectId: projectIdOb
        }).populate({ path: 'participants', select: '_id name email profilePicUrl role createdAt updatedAt' });

        if (isConvoExists) {
            return isConvoExists;
        }

        const savedConvo = await newConversation.save();
        const startedConvo = await savedConvo.populate({ path: 'participants', select: '_id name email profilePicUrl role createdAt updatedAt' });

        if (!startedConvo) {
            throw new Error('Error occured while starting conversation.');
        }

        return startedConvo;
    }

}