import React from 'react';
import { Task, TaskStatus } from '../types';
import { format, parseISO, isPast, differenceInHours } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Trash2, Edit2, Clock, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { cn } from '../utils/cn';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

/**
 * Thành phần hiển thị một thẻ công việc
 */
export const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate, onDelete, onEdit }) => {
  const deadlineDate = parseISO(task.deadline);
  const isOverdue = task.status !== 'DONE' && isPast(deadlineDate);
  const hoursToDeadline = differenceInHours(deadlineDate, new Date());
  const isUrgent = task.status !== 'DONE' && !isOverdue && hoursToDeadline >= 0 && hoursToDeadline <= 24;

  const statusColors = {
    TODO: 'bg-slate-100 text-slate-700 border-slate-200',
    IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
    DONE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  const statusIcons = {
    TODO: <Circle className="w-4 h-4" />,
    IN_PROGRESS: <Clock className="w-4 h-4" />,
    DONE: <CheckCircle2 className="w-4 h-4" />,
  };

  /**
   * Chuyển đổi trạng thái công việc một cách nhanh chóng
   */
  const toggleStatus = () => {
    const nextStatus: Record<TaskStatus, TaskStatus> = {
      TODO: 'IN_PROGRESS',
      IN_PROGRESS: 'DONE',
      DONE: 'TODO',
    };
    onUpdate(task.id, { status: nextStatus[task.status] });
  };

  return (
    <div 
      className={cn(
        "group relative bg-white border rounded-xl p-4 transition-all hover:shadow-md",
        isOverdue ? "border-red-200 bg-red-50/30" : "border-slate-200",
        task.status === 'DONE' && "opacity-75"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <button 
          onClick={toggleStatus}
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border transition-colors",
            statusColors[task.status]
          )}
        >
          {statusIcons[task.status]}
          {task.status}
        </button>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Chỉnh sửa"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className={cn(
        "font-semibold text-slate-900 mb-1 line-clamp-1",
        task.status === 'DONE' && "line-through text-slate-500"
      )}>
        {task.title}
      </h3>
      
      <p className="text-sm text-slate-600 mb-4 line-clamp-2 min-h-[2.5rem]">
        {task.description || "Không có mô tả."}
      </p>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
        <div className={cn(
          "flex items-center gap-1.5 text-xs font-medium",
          isOverdue ? "text-red-600" : isUrgent ? "text-amber-600" : "text-slate-500"
        )}>
          <Clock className="w-3.5 h-3.5" />
          <span>
            {format(deadlineDate, 'dd/MM/yyyy HH:mm', { locale: vi })}
          </span>
          {isUrgent && (
            <span className="flex items-center gap-0.5 animate-pulse">
              <AlertCircle className="w-3 h-3" />
              Sắp đến hạn!
            </span>
          )}
          {isOverdue && (
            <span className="flex items-center gap-0.5">
              <AlertCircle className="w-3 h-3" />
              Quá hạn!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
