import otpGenerator from 'otp-generator';
import { IGenerateRoomIdUsecase } from '../../../config/Dependency/user/groupcall.di';

export class GenerateRoomIdUsecase implements IGenerateRoomIdUsecase {
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