import mongoose from "mongoose";
import { Task } from "../../domain/entities/task.interface";
import { IBacklogRepository } from "../../domain/repositories/backlog.repo";
import taskModel from "../database/task.models";
import { Team } from "../../domain/entities/team.interface";
import SprintModel from "../database/sprint.models";
import { Sprint } from "../../domain/entities/sprint.interface";


export class BacklogRepositoryImp implements IBacklogRepository {


    async startSprint(sprintId: string, sprintName: string, duration: number, startDate: Date): Promise<any> {

        const sprintIdOb = new mongoose.Types.ObjectId(sprintId);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + duration - 1);
        const updatedSprint = await SprintModel.findByIdAndUpdate({ _id: sprintIdOb }, {
            $set: {
                name: sprintName,
                startDate: startDate,
                endDate: endDate,
                status: 'active'
            }
        }, { new: true }).populate({ path: 'tasks' });

        if (!updatedSprint) {
            throw new Error('Sprint not found');
        }

        return updatedSprint;

    }


    async changeTaskStatus(taskId: string, status: string): Promise<Task> {

        const taskIdOb = new mongoose.Types.ObjectId(taskId);
        const updatedTask = await taskModel.findByIdAndUpdate(taskIdOb, { $set: { status: status } }, { new: true });

        if (!updatedTask) {

            throw new Error("Task couldnt update");
        }
        return updatedTask;
    }


    async dragDropUpdation(prevContainerId: string, containerId: string, movedTaskId: string): Promise<any> {

        const movedTaskIdOb = new mongoose.Types.ObjectId(movedTaskId);
        let containerIdOb = null;
        let updatedSprint = null;
        let prevContainerIdOb = null;

        if (containerId !== 'backlog-drop-list') {
            containerId = containerId.split('-')[1];
            containerIdOb = new mongoose.Types.ObjectId(containerId);

            //Adding moved task to the array of sprint document
            updatedSprint = await SprintModel.updateOne({ _id: containerIdOb }, { $addToSet: { tasks: movedTaskIdOb } });
            if (!updatedSprint) {
                throw new Error('Error occured while trying to updated the sprint document');
            }
        }
        if (prevContainerId !== 'backlog-drop-list') {
            prevContainerId = prevContainerId.split('-')[1];
            prevContainerIdOb = new mongoose.Types.ObjectId(prevContainerId);
            updatedSprint = await SprintModel.updateOne({ _id: prevContainerIdOb }, { $pull: { tasks: movedTaskIdOb } });
        }
        const updatedData = await taskModel.findOneAndUpdate(
            { _id: movedTaskIdOb }, { sprintId: containerIdOb }, { new: true })

        if (!updatedData) throw new Error('Error occured while updating task');
        return updatedData;
    }


    async getSprints(projectId: string): Promise<any> {

        const projectIdOb = new mongoose.Types.ObjectId(projectId);

        //Here you need to check whether the user is member of the project.
        //Otherwise the user might be able to send api request from postman and get the data.

        const availableSprints: Sprint[] = await SprintModel.find({ projectId: projectIdOb })
            .populate({
                path: 'tasks', model: 'Task',
                populate: {
                    path: 'assignedTo',
                    model: 'User',
                    select: '_id name email profilePicUrl role createdAt updatedAt'
                }
            }).exec();
        if (!availableSprints) throw new Error('Error occured while fetching sprints');
        return availableSprints;
    }


    async createSprint(projectId: string, issueIds: Array<string>, userId: string): Promise<Sprint> {

        const projectIdOb = new mongoose.Types.ObjectId(projectId);
        const issueIdsOb = issueIds.map(issueId => new mongoose.Types.ObjectId(issueId));
        const userIdOb = new mongoose.Types.ObjectId(userId);


        const availableSprints: Sprint[] = await SprintModel.find({ projectId: projectIdOb });
        const ob = { name: 'Sprint 1', sprintCount: 1 };

        if (availableSprints.length > 0) {
            const lastSprintCount = Math.max(...availableSprints.map(s => s.sprintCount));
            ob.sprintCount = lastSprintCount + 1;
            ob.name = `Sprint ${ob.sprintCount}`;
        }

        const newSprint = new SprintModel({
            name: ob.name,
            sprintCount: ob.sprintCount,
            projectId: projectIdOb,
            createdBy: userIdOb,
            tasks: issueIdsOb
        });

        const createdSprint = await newSprint.save();
        if (!createdSprint) throw new Error('Error occured while creating sprint');
        const updatedTask = await Promise.all(
            issueIdsOb.map((issueId) =>
                taskModel.findByIdAndUpdate(issueId, { sprintId: createdSprint._id }, { new: true })
                    .populate({
                        path: 'assignedTo',
                        select: '_id name email profilePicUrl role createdAt updatedAt'
                    }).exec()
            ));
        createdSprint.tasks = updatedTask as Array<Task>;
        return createdSprint;
    }



    async assignIssue(issueId: string, userId: string): Promise<Task | null> {

        const issueIdOb = new mongoose.Types.ObjectId(issueId);

        let userIdOb;
        if (userId === '' || !userId) {
            userIdOb = null;
        } else {
            userIdOb = new mongoose.Types.ObjectId(userId);
        }

        const issueData = await taskModel
            .findByIdAndUpdate(issueIdOb, { assignedTo: userIdOb }, { new: true })
            .populate({ path: 'assignedTo', select: '_id name email profilePicUrl role createdAt updatedAt' });
        if (!issueData) {
            return null;
        }
        issueData.assignedTo = issueData.assignedTo as unknown as Team;
        return issueData;
    }


    async createIssue(projectId: string, issueType: string, issueName: string, taskGroup: string, epicId: string): Promise<Task> {

        const projectIdOb = new mongoose.Types.ObjectId(projectId);
        const epicIdOb = epicId ? new mongoose.Types.ObjectId(epicId) : null;

        let sprintId = taskGroup === 'backlog' ? null : new mongoose.Types.ObjectId(taskGroup);

        const newTask = new taskModel({
            title: issueName,
            type: issueType,
            status: 'todo',
            epicId: epicIdOb,
            sprintId: sprintId,
            projectId: projectIdOb
        });

        const createdTask = await newTask.save();
        if (taskGroup !== 'backlog') {
            await SprintModel.findByIdAndUpdate(sprintId, { $push: { tasks: createdTask._id } });
        }
        if (!createdTask) throw new Error('Error occured while creating task');

        return createdTask;

    }


    async getTasks(projectId: string, userRole: string, userId: string): Promise<any> {

        const projectIdOb = new mongoose.Types.ObjectId(projectId);
        const userIdOb = new mongoose.Types.ObjectId(userId);

        let query: any = { projectId: projectIdOb };
        if (userRole === 'user') {
            query.assignedTo = userIdOb;
        }
        const tasks = await taskModel.find(query)
            .populate({ path: 'assignedTo', select: '_id name email profilePicUrl role createdAt updatedAt' })
            .populate({ path: 'sprintId' });
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
        if (!createdTask) return null;

        return createdTask;

    }

}