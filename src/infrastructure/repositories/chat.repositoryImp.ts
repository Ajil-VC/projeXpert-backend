import mongoose from "mongoose";
import { IChatRepository } from "../../domain/repositories/chat.repo";
import conversationModel from "../database/conversation.models";
import messageModel from "../database/message.models";



export class ChatRepositoryImp implements IChatRepository {


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

        await conversationModel.updateOne({ _id: convoIdOb }, { $set: { lastMessage: message } });

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