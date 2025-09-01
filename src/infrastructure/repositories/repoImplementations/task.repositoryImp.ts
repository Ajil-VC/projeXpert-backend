import mongoose, { ObjectId, Types } from "mongoose";
import { ITaskRepository } from "../../../domain/repositories/task.repo";
import { Comment, Task } from "../../database/models/task.interface";
import taskModel from "../../database/task.models";
import SprintModel from "../../database/sprint.models";
import commentModel from "../../database/comment.models";



export class TaskRepositoryImp implements ITaskRepository {


    async getTask(taskId: string): Promise<Task> {

        const taskOb = new mongoose.Types.ObjectId(taskId);
        const task = await taskModel.findOne({ _id: taskOb })
            .populate({ path: 'sprintId' });
        if (!task) {

            throw new Error("Coundnt findout the task.");
        }

        return task;
    }


    async getAllTasksUnderEpic(epicId: string): Promise<Task[]> {

        const epicIdOb = new mongoose.Types.ObjectId(epicId);
        const tasks = await taskModel.find({ epicId: epicIdOb });
        if (!tasks) {

            throw new Error("Tasks under epic couldnt get.");
        }

        return tasks;
    }

    async updateEpicProgress(epicId: string, progress: number): Promise<Task> {

        const epicIdOb = new mongoose.Types.ObjectId(epicId);
        const updatedEpic = await taskModel.findOneAndUpdate({ _id: epicIdOb }, { $set: { progress: progress } }, { new: true });

        if (!updatedEpic) {
            throw new Error('Couldnt update the epic');
        }

        return updatedEpic;
    }

    async addComment(userId: string, taskId: string, content: string): Promise<Comment> {

        const userIdOb = new mongoose.Types.ObjectId(userId);
        const taskIdOb = new mongoose.Types.ObjectId(taskId);

        const newComment = new commentModel({
            taskId: taskIdOb,
            userId: userIdOb,
            content: content,
        });

        const comment = await newComment.save();
        if (!comment) throw new Error('Couldnt add comment');

        const createdComment = await commentModel.findOne({ _id: comment._id })
            .populate({ path: 'userId', select: '_id name email profilePicUrl role' });

        if (!createdComment) throw new Error('Couldnt get the added comment');

        return createdComment;

    }



    async getCommentsInTask(taskId: string): Promise<Comment[]> {

        const taskIdOb = new mongoose.Types.ObjectId(taskId);

        const comments = await commentModel.find({ taskId: taskIdOb })
            .populate({ path: 'userId', select: '_id name email profilePicUrl role' }).sort({ createdAt: -1 });

        if (!comments) {
            throw new Error("Method not implemented.");
        }

        return comments;
    }


    async removeAttachment(publicId: string, taskId: string): Promise<Task> {

        const taskIdOb = new mongoose.Types.ObjectId(taskId);

        const updatedTask = await taskModel.findByIdAndUpdate(
            taskIdOb,
            { $pull: { attachments: { public_id: publicId } } },
            { new: true }
        );

        if (!updatedTask) {

            throw new Error("Couldnt update task.");
        }

        return updatedTask;
    }


    async completeSprint(completingSprintId: string, movingSprintId: string | null, projectId: string): Promise<Array<Task> | null> {

        const finishingSprintIdOb = new mongoose.Types.ObjectId(completingSprintId);
        const projectIdOb = new mongoose.Types.ObjectId(projectId);
        let movingSprintIdOb;
        if (movingSprintId !== 'backlog' && movingSprintId !== null) {
            movingSprintIdOb = new mongoose.Types.ObjectId(movingSprintId);
        }

        if (movingSprintId === null) {
            await SprintModel.updateOne(
                { _id: finishingSprintIdOb },
                {
                    $set: {
                        status: 'completed'
                    }
                }
            )
            return [];
        } else {

            const completingSprint = await SprintModel.findOne({ projectId: projectIdOb, _id: finishingSprintIdOb }).populate({
                path: 'tasks'
            });

            if (!completingSprint) {
                return null;
            }
            completingSprint.tasks = completingSprint.tasks as Array<Task>;
            const inCompletedTasks = completingSprint?.tasks.filter((task: Task) => task?.status !== 'done')

            //Updating the moving sprint by adding incompleted tasks into it.
            const taskIds = inCompletedTasks.map((task: Task) => task._id);

            if (movingSprintId === 'backlog') {

                const result = await Promise.all([
                    taskModel.updateMany(
                        { _id: { $in: taskIds } },
                        { $set: { sprintId: null } }
                    ),
                    SprintModel.updateOne(
                        { _id: finishingSprintIdOb },
                        {
                            $pull: {
                                tasks: { $in: taskIds }
                            },
                            $set: {
                                status: 'completed'
                            }
                        }
                    )
                ]);
            } else {

                const result = await Promise.all([
                    SprintModel.updateOne(
                        { _id: movingSprintIdOb },
                        {
                            $addToSet: {
                                tasks: { $each: taskIds }
                            }
                        }
                    ),
                    taskModel.updateMany(
                        { _id: { $in: taskIds } },
                        { $set: { sprintId: movingSprintIdOb } }
                    ),
                    SprintModel.updateOne(
                        { _id: finishingSprintIdOb },
                        {
                            $pull: {
                                tasks: { $in: taskIds }
                            },
                            $set: {
                                status: 'completed'
                            }
                        }
                    )
                ]);

                const [sprintUpdateRes, taskUpdateRes, completedSprintUpdate] = result;
                if (sprintUpdateRes.modifiedCount < 1) {
                    throw new Error('Tasks id couldnt add into moving sprint.');
                } else if (taskUpdateRes.modifiedCount < taskIds.length) {
                    throw new Error('tasks couldnt update.');
                } else if (completedSprintUpdate.modifiedCount < 1) {
                    throw new Error('Tasks couldnt remove from the sprint');
                }
            }


            const updatedTasks = await taskModel.find({ _id: { $in: taskIds } }).populate({
                path: 'sprintId'
            });

            return updatedTasks;
        }
    }


    async updateTaskDetails(task: Task, assigneeId: string): Promise<Task> {

        let assigneeIdOb = assigneeId.length == 0 ? null : new mongoose.Types.ObjectId(assigneeId);

        const taskDetails = task;
        const taskId = typeof taskDetails._id === "string" ? new mongoose.Types.ObjectId(taskDetails._id) : null;
        if (!taskId) {
            throw new Error('Task Id is not valid.');
        }

        const updatePayload: any = {
            title: taskDetails.title,
            type: taskDetails.type,
            status: taskDetails.status,
            priority: taskDetails.priority,
            description: taskDetails.description,

        };

        if (assigneeIdOb) {
            updatePayload.assignedTo = assigneeIdOb;
        }


        const updatedTask = await taskModel.findOneAndUpdate(
            { _id: taskId },
            {
                $set: updatePayload,
                $push: { attachments: { $each: taskDetails.attachments } }
            },
            { new: true }
        ).populate({ path: 'assignedTo', select: '_id name email profilePicUrl role createdAt updatedAt' })
            .populate({ path: 'sprintId' });

        if (!updatedTask) {
            throw new Error('Couldnt update task');
        }

        return updatedTask;
    }

}
