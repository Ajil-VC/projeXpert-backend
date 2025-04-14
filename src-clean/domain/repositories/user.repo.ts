
import { User } from "../entities/user.interface";
import { WorkSpace } from "../entities/workspace.interface";

export interface IUserRepository {

    findByEmail(email: string): Promise<User | null>
    createUser(email: string, userName: string, passWord: string | undefined): Promise<{ user: User, workspace: WorkSpace } | null>
    findUserById(userId: string): Promise<User | null>

}