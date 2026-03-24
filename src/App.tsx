import { useState, useMemo } from 'react';
import { useTasks } from './hooks/useTasks';
import { Task, TaskStatus } from './types';
import { TaskCard } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';
import { StatsBoard } from './components/StatsBoard';
import { Plus, Search, Filter, LayoutList, Kanban, CheckCircle2 } from 'lucide-react';
import { cn } from './utils/cn';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { tasks, addTask, updateTask, deleteTask, stats } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'LIST' | 'BOARD'>('LIST');

  /**
   * Lọc danh sách công việc dựa trên tìm kiếm và trạng thái
   */
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchQuery, statusFilter]);

  /**
   * Mở form để thêm công việc mới
   */
  const handleAddNew = () => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  };

  /**
   * Mở form để chỉnh sửa công việc hiện có
   */
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  /**
   * Lưu công việc (thêm mới hoặc cập nhật)
   */
  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight">Single Page Application</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Tìm nhanh..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-1.5 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-full text-sm transition-all w-40 md:w-64 outline-none"
              />
            </div>
            <button 
              onClick={handleAddNew}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-xl sm:rounded-full font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">Thêm Task</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Section */}
        <section>
          <StatsBoard stats={stats} />
        </section>

        {/* Controls Section */}
        <div className="flex flex-col gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide w-full sm:w-auto">
              <button 
                onClick={() => setStatusFilter('ALL')}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                  statusFilter === 'ALL' ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                Tất cả
              </button>
              <button 
                onClick={() => setStatusFilter('TODO')}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                  statusFilter === 'TODO' ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                Cần làm
              </button>
              <button 
                onClick={() => setStatusFilter('IN_PROGRESS')}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                  statusFilter === 'IN_PROGRESS' ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                Đang làm
              </button>
              <button 
                onClick={() => setStatusFilter('DONE')}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                  statusFilter === 'DONE' ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                Hoàn thành
              </button>
            </div>

            <div className="hidden sm:flex bg-slate-100 p-1 rounded-xl shrink-0">
              <button 
                onClick={() => setViewMode('LIST')}
                className={cn(
                  "p-1.5 rounded-lg transition-all",
                  viewMode === 'LIST' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
                )}
                title="Dạng lưới"
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('BOARD')}
                className={cn(
                  "p-1.5 rounded-lg transition-all",
                  viewMode === 'BOARD' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
                )}
                title="Dạng bảng (Kanban)"
              >
                <Kanban className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm công việc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm transition-all outline-none"
              />
            </div>
            <div className="flex sm:hidden bg-slate-100 p-1 rounded-xl shrink-0">
              <button 
                onClick={() => setViewMode('LIST')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === 'LIST' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('BOARD')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === 'BOARD' ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"
                )}
              >
                <Kanban className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tasks Grid/Board */}
        <AnimatePresence mode="wait">
          {viewMode === 'LIST' ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                    onEdit={handleEdit}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                    <Search className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Không tìm thấy công việc nào</h3>
                  <p className="text-slate-500">Hãy thử thay đổi bộ lọc hoặc thêm công việc mới.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="board"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col lg:grid lg:grid-cols-3 gap-6 items-start"
            >
              {(['TODO', 'IN_PROGRESS', 'DONE'] as TaskStatus[]).map((status) => (
                <div key={status} className="w-full bg-slate-100/50 rounded-2xl p-4 space-y-4 min-h-[150px] lg:min-h-[500px]">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2 uppercase text-[10px] sm:text-xs tracking-widest">
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        status === 'TODO' ? "bg-slate-400" : status === 'IN_PROGRESS' ? "bg-blue-500" : "bg-emerald-500"
                      )} />
                      {status === 'TODO' ? 'Cần làm' : status === 'IN_PROGRESS' ? 'Đang làm' : 'Hoàn thành'}
                    </h3>
                    <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-500 border border-slate-200">
                      {tasks.filter(t => t.status === status).length}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    {tasks
                      .filter(t => t.status === status)
                      .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((task) => (
                        <TaskCard 
                          key={task.id} 
                          task={task} 
                          onUpdate={updateTask}
                          onDelete={deleteTask}
                          onEdit={handleEdit}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Task Form Modal */}
      {isFormOpen && (
        <TaskForm 
          task={editingTask}
          onSave={handleSaveTask}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-slate-200 mt-12">
        <p className="text-center text-sm text-slate-500 italic">
          &copy; 2026 Single Page Application - Quản lý công việc hiệu quả hơn mỗi ngày.
        </p>
      </footer>
    </div>
  );
}
