import { IUserRepository } from "../../../domain/repositories/user.repo";


export class IsUserBlockedUsecase {

    constructor(private _userRepo: IUserRepository) { }

    async execute(userId: string) {
        const result = await this._userRepo.findUserById(userId);
        if (!result) {
            throw new Error('Error occured while geting user data');
        }

        return result;
    }
}