
import { User } from "../../domain/entities/user.interface";
import { WorkSpace } from "../../domain/entities/workspace.interface";
import { IUserRepository } from "../../domain/repositories/user.repo";
import userModel from "../database/user.models";
import workSpaceModel from "../database/workspace.models";


export class userRepositoryImp implements IUserRepository {

    async findByEmail(email: string): Promise<User | null> {

        const isEmailExist: any = await userModel.findOne({ email: email }).populate('workspaceIds');
        if (isEmailExist) return isEmailExist;

        return null;
    }

    async createUser(email: string, userName: string, passWord: string | undefined): Promise<{ user: User, workspace: WorkSpace } | null> {

        const newUser = new userModel({
            name: userName,
            email: email,
            password: passWord,
            plan: 'Free',
        })


        const userData = await newUser.save();
        if (userData) {

            const newWorkSpace = new workSpaceModel({
                name: 'My Workspace',
                owner: userData._id,
                isDefault: true,
                members: [userData._id]
            })
            const createdWorkSpace = await newWorkSpace.save();
            userData.workspaceIds.push(createdWorkSpace._id);
            await userData.save();

            return { user: userData, workspace: createdWorkSpace };

        }

        return null;
    }

    async findUserById(userId: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

}