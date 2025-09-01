import mongoose from "mongoose";
import { IActivityRepository } from "../../../domain/repositories/activity.repo";
import activityModel from "../../database/activity.models";
import { Activity } from "../../database/models/activity.interface";



export class ActivityRepositoryImp implements IActivityRepository {


    async getActivities(companyId: string, projectId: string): Promise<Activity[]> {

        const companyOb = new mongoose.Types.ObjectId(companyId);
        const projOb = new mongoose.Types.ObjectId(projectId);
        const activities = await activityModel.find({ companyId: companyOb, projectId: projOb }).sort({ createdAt: -1 }).limit(5).populate({ path: 'user' });
        if (!activities) throw new Error('Couldnt find out activities');
        return activities;

    }

    async addActivity(projectId: string, companyId: string, userId: string, action: string, target: string | null): Promise<void> {

        const companyOb = new mongoose.Types.ObjectId(companyId);
        const projectOb = new mongoose.Types.ObjectId(projectId);
        const userOb = new mongoose.Types.ObjectId(userId);

        const newActivity = new activityModel({
            companyId: companyOb,
            projectId: projectOb,
            user: userOb,
            action: action,
            target
        });

        await newActivity.save();

    }


}