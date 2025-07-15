import mongoose, { isValidObjectId } from "mongoose";
import { IProjectRepository } from "../../../domain/repositories/project.repo";
import projectModel from "../../database/project.models";
import { Project } from "../../database/models/project.interface";
import workSpaceModel from "../../database/workspace.models";
import { IUserRepository } from "../../../domain/repositories/user.repo";
import userModel from "../../database/user.models";
import { Task } from "../../database/models/task.interface";
import taskModel from "../../database/task.models";
import { BaseRepository } from "../base.repository";


export class projectRepositoryImp extends BaseRepository<Project> implements IProjectRepository {

    constructor(private userRepo: IUserRepository) { 
        super(projectModel);
    }


    async retrieveProject(projectId: string): Promise<Project> {

        return await this.findByIdWithPopulateOrThrow(projectId, { path: 'members' });
    }


    async countProjects(companyId: string): Promise<number> {

        const companyOb = new mongoose.Types.ObjectId(companyId);
        const projectCount = await projectModel.countDocuments({ companyId: companyOb });
        return projectCount;

    }


    async projectStats(projectId: string, userId: string, userRole: "admin" | "user"): Promise<Task[]> {

        const projectIdOb = new mongoose.Types.ObjectId(projectId);
        const userIdOb = new mongoose.Types.ObjectId(userId);

        const query: any = { projectId: projectIdOb };
        if (userRole === 'user') {
            query['assignedTo'] = userIdOb;
        }

        const availableTasks = await taskModel.find(query)
            .populate({ path: 'sprintId' });
        if (!availableTasks) {

            throw new Error("Couldnt findout the tasks");
        }

        return availableTasks;
    }

    async getCurProject(workspaceId: string, projectId: string): Promise<any> {

        const projectIdOb = new mongoose.Types.ObjectId(projectId);
        const workSpaceIdOb = new mongoose.Types.ObjectId(workspaceId);

        const workSpace = await workSpaceModel.findById(workSpaceIdOb)
            .populate({ path: 'projects' }).exec();

        const unknownData = workSpace?.projects as unknown;
        const workspaceWithProjects = unknownData as Array<Project>
        if (!workspaceWithProjects) throw new Error('Projects not available.');

        for (let project of workspaceWithProjects) {
            const proId = project._id as unknown;
            if (projectIdOb.equals(new mongoose.Types.ObjectId(proId as string))) {
                return project;
            }
        }

        return null;

    }

    async removeMemberFromProject(projectId: string, userId: string): Promise<boolean> {

        const projectIdOb = new mongoose.Types.ObjectId(projectId);
        const userIdOb = new mongoose.Types.ObjectId(userId);

        const result = await projectModel.updateOne({ _id: projectIdOb }, { $pull: { members: userIdOb } })
        if (!result.acknowledged) throw new Error('User couldnt remove from the array.');

        const userData = await userModel.findById({ _id: userIdOb });
        if (!userData) throw new Error('Project might be still there in user data');

        const projIdInUser = userData.lastActiveProjectId;
        if (projIdInUser && projIdInUser.toString() === projectId) {
            userData.lastActiveProjectId = null;
            await userData.save()
        }
        return true;
    }


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


    async updateProject(projectId: string, projectName: string, status: string, priority: string): Promise<Project> {

        const projectIdOb = new mongoose.Types.ObjectId(projectId);

        const updatedResult = await projectModel.findOneAndUpdate(
            { _id: projectIdOb },
            { $set: { name: projectName, status: status, priority: priority } },
            { new: true }
        ).populate({
            path: 'members', model: 'User',
            select: '_id name email profilePicUrl role createdAt updatedAt'
        });

        if (!updatedResult) throw new Error('couldnt update the project');
        return updatedResult;
    }

    async addMemberToProject(projectId: string, email: string, workSpaceId: string): Promise<Project> {

        const projectIdOb = new mongoose.Types.ObjectId(projectId);
        const workSpaceIdOb = new mongoose.Types.ObjectId(workSpaceId);

        const user = await this.userRepo.findByEmail(email);
        if (!user) throw new Error('User couldnt find');

        if (!user.lastActiveProjectId) {
            user.lastActiveProjectId = projectIdOb as unknown as mongoose.Schema.Types.ObjectId;
            await user.save();
        }

        const updates = [
            workSpaceModel.updateOne(
                { _id: workSpaceIdOb },
                { $addToSet: { members: user._id } }
            ),
            userModel.updateOne(
                { _id: user._id },
                { $addToSet: { workspaceIds: workSpaceIdOb } }
            ),
            projectModel.updateOne(
                { _id: projectIdOb },
                { $addToSet: { members: user._id } }
            )
        ];

        await Promise.all(updates);


        const updatedProject = await projectModel.findById(projectIdOb).populate({ path: 'members' }).exec();

        if (!updatedProject) throw new Error('Something went wrong');
        return updatedProject as Project;

    }


    async getProjects(workSpaceId: String, limit: number, skip: number, filter: Array<string>): Promise<{ projects: Array<Project>, totalPage: number }> {

        if (typeof workSpaceId !== 'string') throw new Error('Workspace Id is not valid string');
        const workSpaceObjectId = new mongoose.Types.ObjectId(workSpaceId);

        const totalCount = await projectModel.countDocuments({ workSpace: workSpaceObjectId, status: { $in: filter } });


        const projectsInWorkspace = await projectModel.find({ workSpace: workSpaceObjectId, status: { $in: filter } })
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'members', model: 'User',
                select: '_id name email profilePicUrl role createdAt updatedAt'
            });

        const totalPages = Math.ceil(totalCount / limit);

        if (!projectsInWorkspace) throw new Error('Workspace didnt find');
        return { projects: projectsInWorkspace, totalPage: totalPages };

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

        const userData = await userModel.findById({ _id: memberId });
        if (!userData) throw new Error('User data couldnt find.');

        if (!userData.lastActiveProjectId) {
            userData.lastActiveProjectId = createdProject._id;
            await userData.save();
        }

        return createdProject;
    }

}