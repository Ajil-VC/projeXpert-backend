import { Document, ObjectId } from "mongoose"
import { Team } from "./team.interface";
import { Task } from "./task.interface";


export interface Sprint extends Document {

    _id: ObjectId;
    sprintCount: number;
    name: string;
    description: string;
    goal: string;
    startDate: Date;
    endDate: Date;
    status: 'not-started' | 'active' | 'completed';
    projectId: ObjectId;
    createdBy: ObjectId | Team;
    tasks: ObjectId[] | Array<Task>;
}