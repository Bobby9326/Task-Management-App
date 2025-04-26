export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    userId: string;
  }
  
  export enum TaskStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed"
  }
  
  export interface CreateTaskDto {
    title: string;
    description?: string;
  }
  
  export interface UpdateTaskDto {
    title?: string;
    description?: string;
    status?: TaskStatus;
  }