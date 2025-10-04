import mongoose from "mongoose";
import { ITaskHistoryRepository } from "../../../domain/repositories/taskhistory.repo";
import taskHistoryModel from "../../database/taskhistory.models";
import { TaskAction } from "../../../domain/entities/types/task.types";
import { TaskHistory } from "../../database/models/taskhistory.interface";
import { TaskHistoryParams } from "../../../domain/entities/types/taskHistoryParams";


export class TaskHistoryRepositoryImp implements ITaskHistoryRepository {


    async getTaskHistory(taskId: string): Promise<TaskHistory[]> {

        const taskOb = new mongoose.Types.ObjectId(taskId);
        const history = await taskHistoryModel.find({ taskId: taskOb })
            .sort({ createdAt: -1 })
            .populate({ path: 'updatedBy', select: '_id name email profilePicUrl role createdAt updatedAt' })
            .populate({ path: 'details.assignedTo', select: '_id name email profilePicUrl role createdAt updatedAt' })
            .populate({ path: 'details.subtaskAssignee', select: '_id name email profilePicUrl role createdAt updatedAt' })

        if (!history) {

            throw new Error("Couldnt retrieve task history.");
        }

        return history;
    }

    async addHistory(params: TaskHistoryParams): Promise<void> {

        const {
            taskId,
            updatedBy,
            actionType,
            assignedTo,
            oldStatus,
            newStatus,
            subtaskId,
            subtaskTitle,
            subtaskAssignee
        } = params;

        const taskOb = new mongoose.Types.ObjectId(taskId);
        const updatedByOb = new mongoose.Types.ObjectId(updatedBy);

        const modelObject: {
            taskId: any,
            updatedBy: any,
            actionType: TaskAction,
            details: {
                assignedTo?: any,

                oldStatus?: string,
                newStatus?: string,

                subtaskId?: any,
                subtaskTitle?: string,
                subtaskAssignee?: any
            }
        } = {
            taskId: taskOb,
            updatedBy: updatedByOb,
            actionType,
            details: {}
        }


        if (assignedTo && actionType === "ASSIGN") {


            const assignedToOb = new mongoose.Types.ObjectId(assignedTo);
            modelObject.details.assignedTo = assignedToOb;
            modelObject.details.subtaskTitle = subtaskTitle || undefined

        } else if (subtaskId && actionType === 'DELETE_SUBTASK') {

            let subtaskAssigneeOb;
            const subTaskIdOb = new mongoose.Types.ObjectId(subtaskId);
            if (subtaskAssignee) {
                subtaskAssigneeOb = new mongoose.Types.ObjectId(subtaskAssignee);
            }
            modelObject.details.subtaskId = subTaskIdOb;
            modelObject.details.subtaskTitle = subtaskTitle;
            modelObject.details.subtaskAssignee = subtaskAssigneeOb;

        } else if (actionType === 'STATUS_CHANGE') {

            modelObject.details.newStatus = newStatus;
            modelObject.details.oldStatus = oldStatus;
            modelObject.details.subtaskTitle = subtaskTitle || undefined
        } else if (actionType === "CREATE_SUBTASK") {

            let subtaskAssigneeOb;
            const subTaskIdOb = new mongoose.Types.ObjectId(subtaskId);
            if (subtaskAssignee) {
                subtaskAssigneeOb = new mongoose.Types.ObjectId(subtaskAssignee);
            }
            modelObject.details.subtaskTitle = subtaskTitle;
            modelObject.details.subtaskId = subTaskIdOb;
            modelObject.details.subtaskAssignee = subtaskAssigneeOb;
        }

        const newTaskHistory = new taskHistoryModel(modelObject);
        const createdHistory = await newTaskHistory.save();

        if (!createdHistory) {

            throw new Error("Couldnt create history.");
        }

        return createdHistory;

    }

}