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

export type ITaskType = 'epic' | 'bug' | 'task';
export const TaskType = ['epic', 'bug', 'task'];

export type ITaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export const TaskPriority = ['low', 'medium', 'high', 'urgent'];

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl =
    'https://app.microenv.com/backend/key/5b44f5b2d92346ed2eb405/rest/api/tasks';
  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<IResponse<ITask[]>> {
    return this.http.get<IResponse<ITask[]>>(`${this.apiUrl}/get`);
  }

  addTask(data: ITask): Observable<IResponse<ITask>> {
    return this.http.post<IResponse<ITask>>(`${this.apiUrl}/add`, data);
  }

  editTask(id: number, data: ITask): Observable<IResponse<ITask>> {
    return this.http.put<IResponse<ITask>>(`${this.apiUrl}/${id}`, data);
  }
}
