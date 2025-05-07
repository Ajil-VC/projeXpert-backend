import mongoose from "mongoose";
import { Task } from "../../domain/entities/task.interface";
import { IBacklogRepository } from "../../domain/repositories/backlog.repo";
import taskModel from "../database/task.models";


export class BacklogRepositoryImp implements IBacklogRepository {


    async getTasks(projectId: string, userRole: string, userId: string): Promise<any> {

        const projectIdOb = new mongoose.Types.ObjectId(projectId);
        const userIdOb = new mongoose.Types.ObjectId(userId);

        let query: any = { projectId: projectIdOb };
        if (userRole === 'user') {
            query.assignedTo = userIdOb;
        }
        const tasks = await taskModel.find(query);
        return tasks;

    }


    async createEpic(epicName: string, projectId: string): Promise<Task | null> {

        const projectIdOb = new mongoose.Types.ObjectId(projectId);

        const newTask = new taskModel({
            title: epicName,
            type: "epic",
            status: "in-progress",
            projectId: projectIdOb
        });

        const createdTask = await newTask.save();
        console.log(createdTask, 'createted task');
        if (!createdTask) return null;

        return createdTask;

    }

}