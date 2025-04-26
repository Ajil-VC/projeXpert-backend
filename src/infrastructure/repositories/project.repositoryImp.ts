import mongoose, { isValidObjectId } from "mongoose";
import { IProjectRepository } from "../../domain/repositories/project.repo";
import projectModel from "../database/project.models";
import { Project } from "../../domain/entities/project.interface";
import workSpaceModel from "../database/workspace.models";
import { IUserRepository } from "../../domain/repositories/user.repo";


export class projectRepositoryImp implements IProjectRepository {

    constructor(private userRepo: IUserRepository) { }


    async deleteProject(projectId: string, workSpaceId: string): Promise<any> {

        const projectIdOb = new mongoose.Types.ObjectId(projectId);
        const workSpaceIdOb = new mongoose.Types.ObjectId(workSpaceId);

        await projectModel.deleteOne({ _id: projectIdOb });
        const workSpace = await workSpaceModel.findOne({ _id: workSpaceIdOb });

        if (!workSpace) throw new Error('Something went wrong');
        const currentPro = workSpace.currentProject as unknown;
        const currentProId = new mongoose.Types.ObjectId(currentPro as string);
        if (!isValidObjectId(currentProId)) throw new Error('Not valid ObjectId');

        if (projectIdOb.equals(currentProId)) {
            const result = await workSpaceModel.updateOne({ _id: workSpaceIdOb }, { $pull: { projects: projectIdOb }, $unset: { currentProject: '' } });

            if (result.acknowledged) {
                return true;
            }
        } else {

            const result = await workSpaceModel.updateOne({ _id: workSpaceIdOb }, { $pull: { projects: { $in: [projectIdOb] } } });
            if (result.acknowledged) {
                return true;
            }

        }

        return false;
    }


    async updateProject(projectId: string, projectName: string, status: string, priority: string): Promise<any> {

        const projectIdOb = new mongoose.Types.ObjectId(projectId);

        const updatedResult = await projectModel.updateOne({ _id: projectIdOb },
            { $set: { name: projectName, status: status, priority: priority } }
        );

        if (!updatedResult) throw new Error('couldnt update the project');
        return updatedResult;
    }

    async addMemberToProject(projectId: string, email: string): Promise<Project> {

        const projectIdOb = new mongoose.Types.ObjectId(projectId);

        const user = await this.userRepo.findByEmail(email);
        if (!user) throw new Error('User couldnt find');
        await projectModel.updateOne({ _id: projectIdOb }, { $addToSet: { members: user._id } });

        const updatedProject = await projectModel.findById(projectIdOb).populate({ path: 'members' }).exec();

        if (!updatedProject) throw new Error('Something went wrong');
        return updatedProject as Project;

    }


    async getProjects(workSpaceId: String): Promise<Array<any>> {

        if (typeof workSpaceId !== 'string') throw new Error('Workspace Id is not valid string');
        const workSpaceObjectId = new mongoose.Types.ObjectId(workSpaceId);

        const workSpaceData = await workSpaceModel.findById(workSpaceObjectId)
            .populate({
                path: 'projects',
                populate: {
                    path: 'members'
                }
            }).exec();

        if (!workSpaceData) throw new Error('Workspace didnt find');
        return workSpaceData.projects;

    }

    async createProject(
        projectName: String,
        workSpace: String,
        priority: String,
        companyId: String,
        memberId: String
    ): Promise<Project> {

        if (typeof workSpace !== 'string') throw new Error("Workspace id is not valid string");
        if (typeof companyId !== 'string') throw new Error('Company Id is not valid string');
        if (typeof memberId !== 'string') throw new Error('Member Id is not valid string');

        const workSpaceId = new mongoose.Types.ObjectId(workSpace);
        const companyObjectId = new mongoose.Types.ObjectId(companyId);
        const memberObjectId = new mongoose.Types.ObjectId(memberId);

        const newProject = new projectModel({
            name: projectName,
            workSpace: workSpaceId,
            companyId: companyObjectId,
            members: [memberObjectId],
            priority: priority
        })

        const createdProject = await newProject.save();
        if (!createdProject) throw new Error('Project couldnt created.Internal error');

        await workSpaceModel.updateOne({ _id: workSpaceId }, { $push: { projects: createdProject._id } });

        return createdProject;
    }

}