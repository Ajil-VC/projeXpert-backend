import { Document, ObjectId } from "mongoose";


export interface Subscription extends Document {

    _id: ObjectId;
    name: string;
    price: number;

    billingCycle: 'month' | 'year';

    description: String;
    isActive: boolean;

    maxWorkspace: number;
    maxProjects: number;
    maxMembers: number;
    canUseVideoCall: boolean;

    createdAt?: Date;
    updatedAt?: Date;

}
