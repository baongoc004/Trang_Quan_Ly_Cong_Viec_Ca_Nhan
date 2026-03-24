import React from 'react';
import { TaskStats } from '../types';
import { LayoutGrid, CheckCircle2, AlertCircle, ListTodo } from 'lucide-react';

interface StatsBoardProps {
  stats: TaskStats;
}

/**
 * Thành phần hiển thị bảng thống kê công việc
 */
export const StatsBoard: React.FC<StatsBoardProps> = ({ stats }) => {
  const items = [
    {
      label: 'Tổng số task',
      value: stats.total,
      icon: <LayoutGrid className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50',
    },
    {
      label: 'Hoàn thành',
      value: stats.completed,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50',
    },
    {
      label: 'Đang làm/Cần làm',
      value: stats.todo + stats.inProgress,
      icon: <ListTodo className="w-5 h-5 text-slate-600" />,
      bg: 'bg-slate-50',
    },
    {
      label: 'Quá hạn',
      value: stats.overdue,
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
      bg: 'bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {items.map((item, index) => (
        <div 
          key={index}
          className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 sm:gap-4"
        >
          <div className={`p-2.5 sm:p-3 rounded-xl ${item.bg} shrink-0`}>
            {item.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider truncate">
              {item.label}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-slate-900">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
