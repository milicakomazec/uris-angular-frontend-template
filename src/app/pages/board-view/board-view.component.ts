/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ITask,
  TaskService,
  TaskStatus,
} from '../../services/task/task.service';

export class IBoardColumn {
  constructor(
    public name: string,
    public tasks: ITask[]
  ) {}
}

@Component({
  selector: 'app-board-view',
  standalone: true,
  imports: [DragDropModule, CommonModule],
  templateUrl: './board-view.component.html',
  styleUrl: './board-view.component.scss',
})
export class BoardViewComponent {
  constructor(private taskService: TaskService) {}
  tasks: ITask[] = [];
  columnsName: string[] = TaskStatus;
  boardColumns: IBoardColumn[] = [];
  draggedTaskId: number | null = null;

  ngOnInit(): void {
    this.getAllTasks();
    console.log('board', this.boardColumns);
  }
  getAllTasks(): void {
    this.taskService.getAllTasks().subscribe(
      response => {
        this.tasks = response.result;
        console.log('takss', this.tasks);
        this.columnsName.forEach(column => {
          const tasksForColumn = this.tasks.filter(
            task => task.status === column
          );
          this.boardColumns.push({
            name: column,
            tasks: tasksForColumn.map(task => task),
          });
        });
      },
      error => {
        console.error('Error fetching tasks:', error);
      }
    );
  }

  drop(event: CdkDragDrop<any>) {
    const taskToMove = event.previousContainer.data.tasks[event.previousIndex];
    event.previousContainer.data.tasks.splice(event.previousIndex, 1);
    event.container.data.tasks.splice(event.currentIndex, 0, taskToMove);
    taskToMove.status = event.container.data.column;

    // const taskId = event.item.data.id;
    // console.log('taskId'), taskId;
    const newStatus = event.container.data.column;
    this.taskService.editTask(1, newStatus).subscribe(
      () => {
        console.log('susscefyul');
      },
      error => {
        console.error('Error updating task status:', error);
        // Handle errors accordingly
      }
    );
  }
}
