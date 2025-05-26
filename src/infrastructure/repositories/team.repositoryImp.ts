import mongoose from "mongoose";
import { ITeamRepository } from "../../domain/repositories/team.repo";
import projectModel from "../database/project.models";
import { User } from "../../domain/entities/user.interface";
import { Team } from "../../domain/entities/team.interface";
import taskModel from "../database/task.models";


export class TeamRepositoryImp implements ITeamRepository {

    constructor() { }

    async getTeamMembers(projectId: string): Promise<any> {

        const projectIdOb = new mongoose.Types.ObjectId(projectId);

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