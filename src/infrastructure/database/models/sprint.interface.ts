import { Document, ObjectId } from "mongoose"
import { Team } from "./team.interface";
import { Task } from "./task.interface";

export interface BurndownEntry {
    date: Date;
    remainingPoints: number;
}

export interface Challenge {
    _id: string,
    reportedBy: string,
    description: string,
    impact: string,
    proposedSolution: string,
    status: 'open' | 'resolved',
    createdAt: Date
}

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

    plannedPoints: Number,
    completedPoints: Number,
    velocity: Number,
    velocitySnapshot: Number,
    burndownData: BurndownEntry[],
    challenges: Challenge[]
}