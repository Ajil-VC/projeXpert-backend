import { ChatUseCase } from "../../../application/usecase/chatUseCase/startConversation.usecase";
import { GetChats } from "../../../application/usecase/chatUseCase/getChats.usecase";
import { GetMessagesUseCase } from "../../../application/usecase/chatUseCase/getMessages.usecase";
import { SendMessageUsecase } from "../../../application/usecase/chatUseCase/sendMessage.usecase";

import { ChatRepositoryImp } from "../../../infrastructure/repositories/chat.repositoryImp";
import { IChatRepository } from "../../../domain/repositories/chat.repo";

import { SaveVideoCallUsecase } from "../../../application/usecase/chatUseCase/saveVideocallRecord.usecase";

const chatRepository: IChatRepository = new ChatRepositoryImp();

export const chatUsecase = new ChatUseCase(chatRepository);
export const getChatsUsecase = new GetChats(chatRepository);
export const getMessagesUsecase = new GetMessagesUseCase(chatRepository);
export const sendMessagesUsecase = new SendMessageUsecase(chatRepository);
export const saveVideoCallUse = new SaveVideoCallUsecase(chatRepository);