import otpGenerator from 'otp-generator';

export class GenerateRoomIdUsecase {
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