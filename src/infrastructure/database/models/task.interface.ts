import { Document, ObjectId } from "mongoose";
import { Team } from "./team.interface";
import { Sprint } from "./sprint.interface";
import { User } from "./user.interface";


export interface Attachment {
    public_id: string;
    url: string;
}

export interface Comment {

    taskId: ObjectId,
    userId: ObjectId,
    content: string,
    createdAt: Date;
    updatedAt: Date;
}

export type StoryPoint = 0 | 1 | 2 | 3 | 5 | 8 | 13 | 21;

export interface Task extends Document {

    _id: ObjectId;
    title: string;
    description: string;
    type: "task" | "epic" | "story" | "subtask" | "bug";
    status: "in-progress" | "todo" | "done";
    priority: 'low' | 'medium' | 'high' | 'critical';
    assignedTo: ObjectId | Team;

    epicId: ObjectId | Task;       // Refers to a parent epic if any
    startDate?: Date; // Only for epics (epic timeframe)
    endDate?: Date;   // Only for epics

    createdBy?: ObjectId;
    progress?: number;

    storyPoints: StoryPoint;

    sprintId: ObjectId | Sprint;     // Logical grouping for sprints
    sprintNumber: Number; //Only for sprints
    parentId: ObjectId;     // for subtasks
    subtasks: ObjectId[];
    projectId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
    attachments?: Attachment[];
}