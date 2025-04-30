

import mongoose, { model } from "mongoose";
import { User } from "../../domain/entities/user.interface";
import { IUserRepository } from "../../domain/repositories/user.repo";
import userModel from "../database/user.models";

export class userRepositoryImp implements IUserRepository {


    async updateRole(members: Array<{ email: string; role: string; }>, adminEmail: string): Promise<boolean> {

        try {

            for (const user of members) {
                if (user.email !== adminEmail) {

                    await userModel.updateOne({ email: user.email }, { role: user.role });
                }
            }

            return true;

        } catch (err) {
            console.error('Error while updating user role', err);
            return false;
        }

    }


    async findByEmail(email: string): Promise<User | null> {

        const isEmailExist: any = await userModel.findOne({ email: email })
            .populate('workspaceIds')
            .populate('companyId')
            .populate({
                path: 'defaultWorkspace',
                populate: {
                    path: 'projects',
                    model: 'Project'
                }
            }).exec();

        if (isEmailExist) return isEmailExist;

        return null;
    }

    async createUser(
        email: string,
        userName: string,
        passWord: string | undefined,
        role: 'admin' | 'user' = 'user',
        companyId: string,
        workspaceId: string,
        forceChangePassword: boolean = true,
        systemRole: 'platform-admin' | 'company-user' = 'company-user'): Promise<User | null> {

        const newUser = new userModel({
            name: userName,
            email: email,
            password: passWord,
            role: role,
            companyId: new mongoose.Types.ObjectId(companyId),
            defaultWorkspace: new mongoose.Types.ObjectId(workspaceId),
            workspaceIds: [new mongoose.Types.ObjectId(workspaceId)],
            forceChangePassword,
            systemRole: systemRole
        });

        const userData = await newUser.save();
        if (!userData) return null;
        return userData;

    }

    async findUserById(userId: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

}