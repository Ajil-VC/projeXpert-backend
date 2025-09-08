import mongoose from "mongoose";
import { Task } from "../../database/models/task.interface";
import { IBacklogRepository } from "../../../domain/repositories/backlog.repo";
import taskModel from "../../database/task.models";
import { Team } from "../../database/models/team.interface";
import SprintModel from "../../database/sprint.models";
import { Sprint } from "../../database/models/sprint.interface";
import taskHistoryModel from "../../database/taskhistory.models";
import { Permissions } from "../../database/models/role.interface";


export class BacklogRepositoryImp implements IBacklogRepository {


    async removeTask(taskId: string): Promise<boolean> {

        const taskOb = new mongoose.Types.ObjectId(taskId);
        const result = await taskModel.findByIdAndDelete(taskOb);
        await taskHistoryModel.deleteMany({ taskId: taskOb });
        if (result) return true;
        return false;

    }


    async getSubtasks(parentId: string, isKanban = false, parentIdArray = []): Promise<Task[]> {

        if (!isKanban) {

            const parentIdOb = new mongoose.Types.ObjectId(parentId);
            const subtasks = await taskModel.find({ parentId: parentIdOb })
                .populate({ path: 'assignedTo', select: '_id name email profilePicUrl role createdAt updatedAt' });

            if (!subtasks) {
                throw new Error("Couldnt retrieve subtasks.");
            }

            return subtasks;
        } else {

            const subtasks = await taskModel.find({ parentId: { $in: parentIdArray } })
                .populate({ path: 'assignedTo', select: '_id name email profilePicUrl role createdAt updatedAt' })
                .populate({
                    path: "parentId",
                    populate: { path: 'sprintId' }
                });
            return subtasks;

        }

    }


    async createSubtask(title: string, type: string, parentId: string, projectId: string): Promise<Task> {

        const parentIdOb = new mongoose.Types.ObjectId(parentId);
        const projectOb = new mongoose.Types.ObjectId(projectId);

        const newTask = new taskModel({
            title,
            type,
            parentId: parentIdOb,
            projectId: projectOb
        });

        const createdTask = await newTask.save();

        if (!createdTask) throw new Error('Error occured while creating subtask');

        return createdTask;

    }


    async isActiveSprint(projectId: string): Promise<boolean> {

        const projectOb = new mongoose.Types.ObjectId(projectId);
        const sprint = await SprintModel.findOne({ projectId: projectOb, status: 'active' });
        if (!sprint) {
            return false;
        }
        return true;
    }


    async updateEpic(title: string, description: string, startDate: string, endDate: string, status: string, epicId: string): Promise<Task | null> {

        const epicIdOb = new mongoose.Types.ObjectId(epicId);
        const updatedEpic = await taskModel.findOneAndUpdate(
            { _id: epicIdOb },
            {
                $set: {
                    title,
                    description,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate),
                    status
                }
            },
            { new: true }
        );
        if (!updatedEpic) return null;

        return updatedEpic;
    }


    async startSprint(sprintId: string, sprintName: string, duration: number, startDate: Date): Promise<Sprint> {

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


    async changeTaskStatus(taskId: string, status: string): Promise<Task | null> {

        const taskIdOb = new mongoose.Types.ObjectId(taskId);
        const childSubtasks = await taskModel.find({ parentId: taskIdOb });
        const incompletedSubtasks = childSubtasks.filter(task => task.status !== 'done');
        if (incompletedSubtasks.length > 0 && status === 'done') {
            return null;
        } else if (childSubtasks.length > 0 && childSubtasks.every(task => task.status === childSubtasks[0].status)) {
            status = childSubtasks[0].status;
        } else if (childSubtasks.some(task => task.status === 'in-progress')) {
            status = 'in-progress';
        } else if (status === 'in-progress' && childSubtasks.filter(task => task.status === 'in-progress').length == 0) {
            if (childSubtasks.some(task => task.status === 'todo') && childSubtasks.some(task => task.status === 'done')) {
                status = 'todo';
            }
        }

        const updatedTask = await taskModel.findByIdAndUpdate(taskIdOb, { $set: { status: status } }, { new: true });
        if (!updatedTask) {

            throw new Error("Task couldnt update");
        }

        const siblingTasks = await taskModel.find({ parentId: updatedTask.parentId });

        if (siblingTasks.length > 0) {

            const statuses = siblingTasks.map(s => s.status);
            let finalStatusOfParent = 'in-progress';
            if (statuses.includes('in-progress')) {
                finalStatusOfParent = 'in-progress';
            } else if (statuses.every(s => s === statuses[0])) {
                finalStatusOfParent = statuses[0];
            } else if (statuses.includes('todo') && statuses.includes('done')) {
                finalStatusOfParent = 'todo';
            }

            await taskModel.updateOne({ _id: updatedTask.parentId }, { $set: { status: finalStatusOfParent } });

        }

        return updatedTask;
    }


    async dragDropUpdation(prevContainerId: string, containerId: string, movedTaskId: string): Promise<Task> {

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


    async getSprints(projectId: string): Promise<Sprint[]> {

        const projectIdOb = new mongoose.Types.ObjectId(projectId);

        //Here you need to check whether the user is member of the project.
        //Otherwise the user might be able to send api request from postman and get the data.

        const availableSprints: Sprint[] = await SprintModel.find({ projectId: projectIdOb })
            .populate({
                path: 'tasks', model: 'Task',
                populate: [
                    {
                        path: 'assignedTo',
                        model: 'User',
                        select: '_id name email profilePicUrl role createdAt updatedAt'
                    },
                    {
                        path: 'epicId',
                        model: 'Task'
                    },
                    {
                        path: 'sprintId',
                        model: 'Sprint'
                    }
                ]
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

        let userIdOb: mongoose.Types.ObjectId | null = null;

        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
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
        const populatedTask = await taskModel.findById(createdTask._id).populate('epicId');

        if (taskGroup !== 'backlog') {
            await SprintModel.findByIdAndUpdate(sprintId, { $push: { tasks: createdTask._id } });
        }

        if (!populatedTask) throw new Error('Error occured while creating task');

        return populatedTask;

    }


    async getTasks(projectId: string, permissions: Array<Permissions>, userId: string, isKanban = false): Promise<any> {

        const projectIdOb = new mongoose.Types.ObjectId(projectId);
        const userIdOb = new mongoose.Types.ObjectId(userId);

        if (!isKanban) {

            let query: any = { projectId: projectIdOb, type: { $ne: 'subtask' } };
            console.log("Here is the problem lies.",permissions)
            if (!permissions.includes('view_all_task')) {
                query.assignedTo = userIdOb;
            }

            const tasks = await taskModel.find(query)
                .populate({ path: 'assignedTo', select: '_id name email profilePicUrl role createdAt updatedAt' })
                .populate({ path: 'sprintId' })
                .populate({ path: 'epicId' });

            return tasks;

        } else if (isKanban) {

            if (permissions.includes('view_all_task')) {
                const tasks = await taskModel.find({
                    projectId: projectIdOb,
                    sprintId: { $ne: null }
                })
                    .populate({
                        path: "sprintId",
                        match: { status: "active" },
                    })
                    .populate({
                        path: "assignedTo",
                        select: "_id name email profilePicUrl role createdAt updatedAt",
                    })
                    .populate({
                        path: "epicId"
                    });

                const activeSprintTasks = tasks.filter(task => task.sprintId !== null);
                return activeSprintTasks;

            } else {

                const [assignedActiveTasks, allActiveTasks] = await Promise.all([

                    taskModel.find({
                        projectId: projectIdOb,
                        sprintId: { $ne: null },
                        assignedTo: userIdOb
                    })
                        .populate({
                            path: "sprintId",
                            match: { status: "active" },
                        })
                        .populate({
                            path: "assignedTo",
                            select: "_id name email profilePicUrl role createdAt updatedAt",
                        })
                        .populate({
                            path: "epicId"
                        }),

                    taskModel.find({
                        projectId: projectIdOb,
                        sprintId: { $ne: null }
                    })
                        .populate({
                            path: "sprintId",
                            match: { status: "active" },
                        })
                        .populate({
                            path: "assignedTo",
                            select: "_id name email profilePicUrl role createdAt updatedAt",
                        })
                        .populate({
                            path: "epicId"
                        })

                ]);


                const activeTaskIds = allActiveTasks.filter(task => task.sprintId !== null)
                    .map((t: Task) => t._id);

                const subtasks = await taskModel.find({ parentId: { $in: activeTaskIds }, assignedTo: userIdOb })
                    .populate({ path: 'assignedTo', select: '_id name email profilePicUrl role createdAt updatedAt' })
                    .populate({
                        path: "parentId",
                        populate: { path: 'sprintId' }
                    });

                const activeSprintTasks = assignedActiveTasks.filter(task => task.sprintId !== null);
                return [...activeSprintTasks, ...subtasks];

            }


        }

    }


    async createEpic(title: string, description: string, startDate: string, endDate: string, projectId: string, userId: string): Promise<Task | null> {

        const projectIdOb = new mongoose.Types.ObjectId(projectId);
        const userIdOb = new mongoose.Types.ObjectId(userId);

        const newTask = new taskModel({
            title: title,
            type: "epic",
            description: description,

            startDate: new Date(startDate),
            endDate: new Date(endDate),
            createdBy: userIdOb,
            status: "in-progress",
            projectId: projectIdOb
        });

        const createdTask = await newTask.save();
        if (!createdTask) return null;

        return createdTask;

    }

}