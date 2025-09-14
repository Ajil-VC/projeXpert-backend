import { ICompanyManagementUsecase } from "../../../config/Dependency/admin/comapanymanage.di";
import { IUserRepository } from "../../../domain/repositories/user.repo";


export class changeUserStatusUseCase implements ICompanyManagementUsecase {

    constructor(private _userRepo: IUserRepository) { }

    async execute(userId: string, status: boolean): Promise<any> {

        const result = await this._userRepo.changeUserStatus(userId, status);

        if (!result) {
            throw new Error('Status couldnt udpate.');
        }

        return result;
    }
}