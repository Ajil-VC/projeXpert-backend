import { Document, ObjectId } from "mongoose";
import { Team } from "./team.interface";

export interface Task extends Document {

    _id: ObjectId;
    title: string;
    description: string;
    type: "task" | "epic" | "story" | "subtask" | "bug";
    status: "in-progress" | "todo" | "done";
    priority: 'low' | 'medium' | 'high' | 'critical';
    assignedTo: ObjectId | Team;
    epicId: ObjectId;       // Refers to a parent epic if any
    sprintId: ObjectId;     // Logical grouping for sprints
    sprintNumber: Number; //Only for sprints
    parentId: ObjectId;     // for subtasks
    projectId: ObjectId;
    createdAt: Date;
    updatedAt: Date;

}