import mongoose from "mongoose";
import { IProjectRepository } from "../../domain/repositories/project.repo";
import projectModel from "../database/project.models";
import { Project } from "../../domain/entities/project.interface";
import workSpaceModel from "../database/workspace.models";
import { User } from "../../domain/entities/user.interface";



export class projectRepositoryImp implements IProjectRepository {


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