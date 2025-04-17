

import mongoose from "mongoose";
import { User } from "../../domain/entities/user.interface";
import { IUserRepository } from "../../domain/repositories/user.repo";
import userModel from "../database/user.models";

export class userRepositoryImp implements IUserRepository {

    async findByEmail(email: string): Promise<User | null> {

        const isEmailExist: any = await userModel.findOne({ email: email }).populate('workspaceIds');
        if (isEmailExist) return isEmailExist;

        return null;
    }

    async createUser(
        email: string,
        userName: string,
        passWord: string | undefined,
        role: 'admin' | 'user' = 'user',
        companyId: string,
        workspaceId: string): Promise<User | null> {

        const newUser = new userModel({
            name: userName,
            email: email,
            password: passWord,
            role: role,
            companyId: new mongoose.Types.ObjectId(companyId),
            workspaceIds: [new mongoose.Types.ObjectId(workspaceId)]
        });

        const userData = await newUser.save();
        if (!userData) return null;
        return userData;

    }

    async findUserById(userId: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }

}