export enum TaskStatus {
  NEW = 'new',
  IN_PROGRESS = 'in progress',
  TESTING = 'testing',
  DONE = 'done',
}

export enum TaskType {
  EPIC = 'epic',
  BUG = 'bug',
  TASK = 'task',
  FEATURE = 'feature',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TaskDistribution {
  TYPE = 'type',
  STATUS = 'status',
  PRIORITY = 'priority',
}
