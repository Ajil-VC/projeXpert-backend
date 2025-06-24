import { TaskEntityDetailed } from "../../../domain/entities/task.entity";
import { TaskResponseDetailedDTO } from "../../dtos/task/taskResponseDTO";

export class TaskMapper {
    static toResponseDTO(task: TaskEntityDetailed): TaskResponseDetailedDTO {
        return {
            id: task.id,
            title: task.title,
            description: task.description,
            type: task.type,
            status: task.status,
            priority: task.priority,
            assignedTo: task.assignedTo
                ? {
                    _id: task.assignedTo._id,
                    name: task.assignedTo.name,
                    email: task.assignedTo.email,
                    profilePicUrl: task.assignedTo.profilePicUrl,
                    role: task.assignedTo.role,
                    createdAt: task.assignedTo.createdAt,
                    updatedAt: task.assignedTo.updatedAt
                }
                : null,
            projectId: task.projectId,
            epicId: task.epicId,
            sprintId: task.sprintId,
            parentId: task.parentId,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt
        };
    }
}
