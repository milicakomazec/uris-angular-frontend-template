import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  TaskPriority,
  TaskService,
  TaskStatus,
  TaskType,
} from '../../services/task/task.service';
import { ITask } from '../../shared/interfaces';

export class IBoardColumn {
  constructor(
    public name: string,
    public tasks: ITask[]
  ) {}
}

@Component({
  selector: 'app-board-view',
  standalone: true,
  imports: [DragDropModule, CommonModule, FormsModule],
  templateUrl: './board-view.component.html',
  styleUrl: './board-view.component.scss',
})
export class BoardViewComponent {
  tasks: ITask[] = [];
  columnsName: string[] = TaskStatus;
  boardColumns: IBoardColumn[] = [];
  draggedTaskId: number | null = null;

  editedTask!: ITask;
  isFormModalVisible: boolean = true;
  taskType = TaskType;
  taskStatus = TaskStatus;
  taskPriority = TaskPriority;
  selectedTask: ITask | null = null;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.getAllTasks();
  }
  getAllTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: response => {
        this.tasks = response.result;

        this.boardColumns = this.columnsName.map(column => ({
          name: column,
          tasks: this.tasks
            .filter(task => task.status === column)
            .map(task => ({ ...task })),
        }));
      },
      error: error => {
        console.error('Error fetching tasks:', error);
      },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  drop(event: CdkDragDrop<any>) {
    const taskToMove = event.previousContainer.data.tasks[event.previousIndex];
    event.previousContainer.data.tasks.splice(event.previousIndex, 1);
    event.container.data.tasks.splice(event.currentIndex, 0, taskToMove);
    taskToMove.status = event.container.data.column;

    const newStatus = event.container.data.column;
    this.taskService.editTask(1, newStatus).subscribe({
      next: () => {
        console.log('Task status updated successfully');
      },
      error: error => {
        console.error('Error updating task status:', error);
      },
    });
  }

  editTask(taskId: number): void {
    const allTasks = this.boardColumns
      .map(column => column.tasks)
      .reduce((acc, val) => acc.concat(val), []);
    this.editedTask = allTasks.find(task => task.id === taskId) as ITask;
  }

  onSubmit(): void {
    this.taskService.editTask(this.editedTask.id, this.editedTask).subscribe({
      next: () => {
        console.log('Task updated successfully');
      },
      error: error => {
        console.error('Error updating task:', error);
      },
    });
    this.isFormModalVisible = false;
  }

  openEditModal(task: ITask) {
    this.selectedTask = task;
    this.isFormModalVisible = true;
    this.editTask(this.selectedTask.id);
  }

  closeEditModal() {
    this.selectedTask = null;
    this.isFormModalVisible = false;
  }
}
