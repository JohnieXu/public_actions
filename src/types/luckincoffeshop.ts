export interface TaskItem {
  taskId: number;
  title: string;
  taskNum: number;
  taskType: number;
  isOrNot: number; // 2: 还未参与 1：已参与
  appTitle: string;
  score: number;
  numberOfDraws: number;
  numberOfResignings: number;
  lotteryActivityId: string;
}

export interface ApiResponse<T = any> {
  code: string;
  msg: string;
  data: T;
}

export interface TaskListResponse extends ApiResponse<TaskItem[]> {} 