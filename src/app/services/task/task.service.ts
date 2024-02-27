import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';

export interface IResponse<ITask> {
  result: ITask;
  status: number;
  message: number;
}

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

export type ITaskStatus = 'new' | 'in progress' | 'testing' | 'done';
export const TaskStatus = ['new', 'in progress', 'testing', 'done'];

export type ITaskType = 'epic' | 'bug' | 'task' | 'feature';
export const TaskType = ['epic', 'bug', 'task', 'feature'];

export type ITaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export const TaskPriority = ['low', 'medium', 'high', 'urgent'];

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl =
    'https://app.microenv.com/backend/key/c24220b2cd4cbf293c2b15/rest/api/tasks';

  private taskIdApiUrl =
    'https://app.microenv.com/backend/key/1b40b895e89f87f922b2b3/rest/api/tasks/';

  readonly TaskStatus: ITaskStatus[] = [
    'new',
    'in progress',
    'testing',
    'done',
  ];
  readonly TaskType: ITaskType[] = ['epic', 'bug', 'task'];
  readonly TaskPriority: ITaskPriority[] = ['low', 'medium', 'high', 'urgent'];

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<IResponse<ITask[]>> {
    return this.http.get<IResponse<ITask[]>>(`${this.apiUrl}/get`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTaskById(id: number): Observable<ITask> {
    return this.http.get<ITask>(`${this.taskIdApiUrl}1`);
  }

  addTask(data: ITask): Observable<IResponse<ITask>> {
    return this.http.post<IResponse<ITask>>(`${this.apiUrl}/add`, data);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editTask(taskId: number, data: any): Observable<ITask> {
    return this.http.put<ITask>(`${this.taskIdApiUrl}1/update`, data);
  }

  deleteTaskById(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${taskId}`);
  }
}
