/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  deadline: string; // ISO string
  createdAt: string; // ISO string
}

export interface TaskStats {
  total: number;
  completed: number;
  overdue: number;
  todo: number;
  inProgress: number;
}
