import { IUserRepository } from "../../../domain/repositories/user.repo";


export class changeUserStatusUseCase {

    constructor(private userRepo: IUserRepository) { }

    async execute(userId: string, status: boolean): Promise<any> {

        const result = await this.userRepo.changeUserStatus(userId, status);

        if (!result) {
            throw new Error('Status couldnt udpate.');
        }

        return result;
    }
}