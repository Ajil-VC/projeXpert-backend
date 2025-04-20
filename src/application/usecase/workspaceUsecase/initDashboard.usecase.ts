import { IUserRepository } from "../../../domain/repositories/user.repo";

export class InitDashBoardUseCase {

    constructor(
        private userRepo: IUserRepository
    ) { }

    async execute(email: string) {

        const userData = await this.userRepo.findByEmail(email);
        return userData;

    }
}