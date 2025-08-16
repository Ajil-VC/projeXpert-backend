import otpGenerator from 'otp-generator';
import { IGenerateRoomId } from '../../../config/Dependency/user/groupcall.di';

export class GenerateRoomIdUsecase implements IGenerateRoomId {
    constructor() { }

    async execute(): Promise<string> {

        const roomId = otpGenerator.generate(5, {
            digits: false,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: true,
            specialChars: false
        });

        return roomId;

    }
}