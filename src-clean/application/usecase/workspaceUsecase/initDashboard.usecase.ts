import { IUserRepository } from "../../../domain/repositories/user.repo";
import { IDecodeToken } from "../../../domain/services/decodeToken.interface";



export class InitDashBoardUseCase {

    constructor(
        private dToken: IDecodeToken,
        private userRepo : IUserRepository
    ) { }

    async execute(token: string) {

        const tokenData = await this.dToken.decode(token);
        const userData = await this.userRepo.findByEmail(tokenData.email)
        
        return userData;

    }
}