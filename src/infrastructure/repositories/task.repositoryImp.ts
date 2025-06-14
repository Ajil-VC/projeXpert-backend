import mongoose from "mongoose";
import { ITaskRepository } from "../../domain/repositories/task.repo";
import { Task } from "../../domain/entities/task.interface";
import taskModel from "../database/task.models";
import SprintModel from "../database/sprint.models";



export class TaskRepositoryImp implements ITaskRepository {


    async completeSprint(completingSprintId: string, movingSprintId: string | null, projectId: string): Promise<Array<Task> | null | boolean> {

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
            return true;
        } else {

            const completingSprint = await SprintModel.findOne({ projectId: projectIdOb, _id: finishingSprintIdOb }).populate({
                path: 'tasks'
            });

            if (!completingSprint) {
                return null;
            }
            completingSprint.tasks = completingSprint.tasks as Array<Task>;
            const inCompletedTasks = completingSprint?.tasks.filter(task => task?.status !== 'done')

            //Updating the moving sprint by adding incompleted tasks into it.
            const taskIds = inCompletedTasks.map(task => task._id);

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


    async updateTaskDetails(task: any, assigneeId: string): Promise<any> {

        let assigneeIdOb = assigneeId.length == 0 ? null : new mongoose.Types.ObjectId(assigneeId);

        const taskDetails = task as Task;
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
            { $set: updatePayload },
            { new: true }
        ).populate({ path: 'assignedTo', select: '_id name email profilePicUrl role createdAt updatedAt' })
            .populate({ path: 'sprintId' });

        if (!updatedTask) {
            throw new Error('Couldnt update task');
        }

        return updatedTask;
    }

}
