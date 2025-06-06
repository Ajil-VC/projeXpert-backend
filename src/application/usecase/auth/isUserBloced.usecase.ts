import { IUserRepository } from "../../../domain/repositories/user.repo";


export class IsUserBlockedUsecase {

    constructor(private userRepo: IUserRepository) { }

    async execute(userId: string) {
        const result = await this.userRepo.findUserById(userId);
        if (!result) {
            throw new Error('Error occured while geting user data');
        }

        return result;
    }
}