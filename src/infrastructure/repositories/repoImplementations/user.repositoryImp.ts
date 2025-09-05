

import mongoose from "mongoose";
import { Attachment, User } from "../../database/models/user.interface";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import userModel from "../../database/user.models";
import { Roles } from "../../database/models/role.interface";
import RolesModel from "../../database/roles.model";

export class userRepositoryImp implements IUserRepository {


    async getRoles(companyId: string): Promise<Array<Roles>> {

        const companyOb = new mongoose.Types.ObjectId(companyId);
        const roles = await RolesModel.find({ companyId: companyOb });
        if (!roles) {

            throw new Error("Couldnt retrieve the roles.");
        }

        return roles;
    }

    async createRole(roleName: string, permissions: Array<string>, description: string, companyId: string): Promise<Roles> {

        const companyOb = new mongoose.Types.ObjectId(companyId);
        const newRole = new RolesModel({
            name: roleName,
            permissions,
            description,
            companyId: companyOb
        });

        const createdRole = await newRole.save();
        if (!createdRole) {
            throw new Error("Couldnt create new role.");
        }

        return createdRole;
    }


    async updateUserProfile(file: Attachment | null, userId: string, name: string): Promise<User> {

        const userIdOb = new mongoose.Types.ObjectId(userId);
        let query: { profilePicUrl?: Attachment, name?: string } = {};
        if (file) {
            query.profilePicUrl = file;
        }
        if (name) {
            query.name = name;
        }
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: userIdOb },
            { $set: query },
        )

        if (!updatedUser) {

            throw new Error("Profile picture coulndt set");
        }

        return updatedUser;
    }



    async updateDefaultWorkspace(workspaceId: string, userId: string): Promise<User> {

        const workSpaceOb = new mongoose.Types.ObjectId(workspaceId);
        const userIdOb = new mongoose.Types.ObjectId(userId);

        const updatedUser = await userModel.findOneAndUpdate(
            { _id: userIdOb },
            { $set: { defaultWorkspace: workSpaceOb } },
        )

        if (!updatedUser) {

            throw new Error("Default workspace coulndt set");
        }

        return updatedUser;
    }


    async changeUserStatus(userId: string, status: boolean): Promise<any> {

        const userIdOb = new mongoose.Types.ObjectId(userId);

        const userData = await userModel.updateOne({ _id: userIdOb }, { $set: { isBlocked: status } });

        if (userData.modifiedCount === 0) {
            throw new Error('Status couldnt udpate.');
        }

        return userData;
    }


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
            .populate('role')
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
        role: string,
        companyId: string,
        workspaceId: string,
        forceChangePassword: boolean = true,
        systemRole: 'platform-admin' | 'company-user' = 'company-user'): Promise<User | null> {

        const roleId = new mongoose.Types.ObjectId(role);

        const newUser = new userModel({
            name: userName,
            email: email,
            password: passWord,
            role: roleId,
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

        const userIdOb = new mongoose.Types.ObjectId(userId);

        const userData: any = await userModel.findOne({ _id: userIdOb })
            .populate('workspaceIds')
            .populate('companyId')
            .populate('role')
            .exec();

        if (!userData) return null;
        return userData;

    }

    async largestEmployer(): Promise<Array<{
        employerCount: number,
        email: string,
        companyName: string
    }>> {

        const data = await userModel.aggregate([
            {
                $group: {
                    _id: "$companyId",
                    employerCount: { $sum: 1 }
                }
            },
            { $sort: { employerCount: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "companies",
                    localField: "_id",
                    foreignField: "_id",
                    as: "company"
                }
            },
            { $unwind: "$company" },
            {
                $project: {
                    _id: 0,
                    employerCount: 1,
                    email: "$company.email",
                    companyName: "$company.name"
                }
            }
        ]);

        if (!data) {

            throw new Error("Couldnt retrieve the data.");
        }

        return data;

    }

}