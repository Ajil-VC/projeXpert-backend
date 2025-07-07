

export class TaskResponseDetailedDTO {

    id!: string;
    title!: string;
    description!: string;
    type!: "task" | "epic" | "story" | "subtask" | "bug";
    status!: "in-progress" | "todo" | "done";
    priority!: 'low' | 'medium' | 'high' | 'critical';
    assignedTo!: {
        _id: string,
        name: string,
        email: string,
        profilePicUrl: string,
        role: string,
        createdAt: string,
        updatedAt: string
    } | null;
    projectId!: string;
    epicId?: string;
    sprintId?: string;
    sprintNumber?: number;
    parentId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}