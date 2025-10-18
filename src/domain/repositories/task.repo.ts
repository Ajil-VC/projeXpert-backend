import { Sprint } from "../../infrastructure/database/models/sprint.interface";
import { PopulatedComment, StoryPoint, Task } from "../../infrastructure/database/models/task.interface";



export interface ITaskRepository {

    getSprintWithID(sprintId: string): Promise<Sprint>;

    setStoryPoint(storyPoints: StoryPoint, taskId: string): Promise<Task>;

    updateTaskDetails(task: Task, assigneeId: string): Promise<Task>;

    completeSprint(completingSprintId: string, movingSprintId: string | null, projectId: string): Promise<Array<Task> | null>;

    removeAttachment(publicId: string, taskId: string): Promise<Task>;

    getCommentsInTask(taskId: string): Promise<PopulatedComment[]>;

    addComment(userId: string, taskId: string, content: string): Promise<PopulatedComment>;

    getAllTasksUnderEpic(epicId: string): Promise<Task[]>;

    updateEpicProgress(epicId: string, progress: number): Promise<Task>;

    getTask(taskId: string): Promise<Task>;
}