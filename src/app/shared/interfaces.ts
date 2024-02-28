export type ITaskStatus = 'new' | 'in progress' | 'testing' | 'done';
export type ITaskType = 'epic' | 'bug' | 'task' | 'feature';
export type ITaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export interface ITask {
  id: number;
  title: string;
  description: string;
  status: ITaskStatus;
  type: string;
  loggedTime: number;
  assignedUserId: number;
  priority: string;
}
export interface IResponse<ITask> {
  result: ITask;
  status: number;
  message: number;
}

export interface GetUserResponse {
  status: number;
  message: number;
  result: IUser[];
}

export interface IUser {
  userId: number;
  email: string;
  fullName: string;
  phone: string;
  mobile: string;
  websiteUrl: string;
  gitHubUrl: string;
  linkedinUrl: string;
  address: string;
}
