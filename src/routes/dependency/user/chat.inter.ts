import { GetChats } from "../../../application/usecase/chatUseCase/getChats.usecase";
import { GetMessagesUseCase } from "../../../application/usecase/chatUseCase/getMessages.usecase";
import { SaveVideoCallUsecase } from "../../../application/usecase/chatUseCase/saveVideocallRecord.usecase";
import { SendMessageUsecase } from "../../../application/usecase/chatUseCase/sendMessage.usecase";
import { ChatUseCase } from "../../../application/usecase/chatUseCase/startConversation.usecase";
import { ChatController } from "../../../controllers/user/chat.controller";
import { IChatRepository } from "../../../domain/repositories/chat.repo";
import { ChatRepositoryImp } from "../../../infrastructure/repositories/repoImplementations/chat.repositoryImp";
import { IChatController } from "../../../interfaces/user/chat.controller.interface";
import { notification } from "./notification.inter";

const chatRepository: IChatRepository = new ChatRepositoryImp();


export const saveVideoCallUse = new SaveVideoCallUsecase(chatRepository);

export const chatUsecase = new ChatUseCase(chatRepository);
export const getChatsUsecase = new GetChats(chatRepository);
export const getMessagesUsecase = new GetMessagesUseCase(chatRepository);
export const sendMessagesUsecase = new SendMessageUsecase(chatRepository);

export const chatControllerInterface: IChatController = new ChatController(
    notification,
    chatUsecase,
    getChatsUsecase,
    getMessagesUsecase,
    sendMessagesUsecase
);