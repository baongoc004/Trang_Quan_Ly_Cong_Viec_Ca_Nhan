import { useState, useEffect, useMemo } from 'react';
import { Task, TaskStatus } from '../types';
import { isPast, isToday, parseISO } from 'date-fns';

const STORAGE_KEY = 'personal-tasks-app-data';

/**
 * Hook tùy chỉnh để quản lý danh sách công việc và lưu trữ vào localStorage
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Lưu vào localStorage mỗi khi danh sách thay đổi
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  /**
   * Thêm một công việc mới
   */
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  /**
   * Cập nhật thông tin công việc
   */
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  /**
   * Xóa một công việc
   */
  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  /**
   * Tính toán thống kê công việc
   */
  const stats = useMemo(() => {
    const now = new Date();
    return tasks.reduce(
      (acc, task) => {
        acc.total++;
        if (task.status === 'DONE') acc.completed++;
        if (task.status === 'TODO') acc.todo++;
        if (task.status === 'IN_PROGRESS') acc.inProgress++;
        
        // Kiểm tra quá hạn (nếu chưa hoàn thành và deadline đã qua)
        if (task.status !== 'DONE' && task.deadline && isPast(parseISO(task.deadline)) && !isToday(parseISO(task.deadline))) {
          acc.overdue++;
        }
        
        return acc;
      },
      { total: 0, completed: 0, overdue: 0, todo: 0, inProgress: 0 }
    );
  }, [tasks]);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    stats,
  };
}
