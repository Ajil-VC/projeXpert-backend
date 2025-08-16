
import { AdminRepositoryImp } from "../../../infrastructure/repositories/adminRepo/admin.repository";
import { AdminInitUseCase } from "../../../application/usecase/admin/admininit.usecase";
import { IAdminRepository } from "../../../domain/repositories/adminRepo/admin.repo";
import { GetAdminUseCase } from "../../../application/usecase/admin/getAdmin.usecase";
import { UserResponseDTO } from "../../../dtos/user/userResponseDTO";


export interface IAdminInitUse {
    execute(): Promise<any>;
}

export interface IAdminData {
    execute(adminId: string): Promise<UserResponseDTO>;
}