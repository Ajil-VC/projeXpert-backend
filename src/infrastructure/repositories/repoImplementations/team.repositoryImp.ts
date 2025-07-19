import mongoose from "mongoose";
import { ITeamRepository } from "../../../domain/repositories/team.repo";
import projectModel from "../../database/project.models";
import { User } from "../../database/models/user.interface";
import { Team } from "../../database/models/team.interface";
import taskModel from "../../database/task.models";
import userModel from "../../database/user.models";
import { BaseRepository } from "../base.repository";


export class TeamRepositoryImp implements ITeamRepository {


    async restrictUser(userId: string, status: boolean | null, userRole: string): Promise<User> {

        const userOb = new mongoose.Types.ObjectId(userId);

        const query: { restrict?: boolean, role: string } = { role: userRole };
        if (status !== null) {
            query.restrict = status;
        }
        const user = await userModel.findByIdAndUpdate(
            userOb,
            query,
            { new: true }
        );

        if (!user) {

            throw new Error("User couldnt update");

        }

        return user;
    }

    async getCompanyUsers(companyId: string): Promise<User[]> {

        const companyIdOb = new mongoose.Types.ObjectId(companyId);
        const users = await userModel.find({ companyId: companyIdOb });

        if (!users) throw new Error('Couldnt retrieve users.');

        return users;
    }

    async getTeamMembers(projectId: string | null, userId: string): Promise<any> {

        const userIdOb = new mongoose.Types.ObjectId(userId);
        let projectIdOb;
        if (!projectId) {

            const user = await userModel.findOne({ _id: userIdOb });
            const defaultWorkspace = user?.defaultWorkspace;
            const project = await projectModel.findOne({ members: userId, workSpace: defaultWorkspace });
            projectIdOb = project?._id;


        } else {

            projectIdOb = new mongoose.Types.ObjectId(projectId);
        }

        const projectData = await projectModel.findById(projectIdOb)
            .populate({ path: 'members' });

        const membersPopulated = projectData?.members as unknown as Array<User>;

        const members: Team[] = membersPopulated.map(user => {
            return {
                _id: user._id,
                name: user.name,
                email: user.email,

                profilePicUrl: user.profilePicUrl,
                role: user.role,

            }
        });

        return members;

    }

}