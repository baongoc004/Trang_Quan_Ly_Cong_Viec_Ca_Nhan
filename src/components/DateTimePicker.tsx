import React, { useState, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  setHours,
  setMinutes,
  getHours,
  getMinutes,
  parseISO
} from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '../utils/cn';

interface DateTimePickerProps {
  value: string; // ISO string
  onChange: (value: string) => void;
}

/**
 * Thành phần chọn ngày và giờ tùy chỉnh chuyên nghiệp
 */
export const DateTimePicker: React.FC<DateTimePickerProps> = ({ value, onChange }) => {
  const selectedDate = useMemo(() => parseISO(value), [value]);
  const [viewDate, setViewDate] = useState(selectedDate);
  const [showTime, setShowTime] = useState(false);

  // Logic cho lịch
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setViewDate(addMonths(viewDate, 1));
  const prevMonth = () => setViewDate(subMonths(viewDate, 1));

  const handleDateClick = (day: Date) => {
    const newDate = setMinutes(setHours(day, getHours(selectedDate)), getMinutes(selectedDate));
    onChange(newDate.toISOString());
    setShowTime(true); // Tự động chuyển sang chọn giờ sau khi chọn ngày
  };

  const handleTimeChange = (type: 'hours' | 'minutes', val: number) => {
    let newDate = selectedDate;
    if (type === 'hours') newDate = setHours(selectedDate, val);
    if (type === 'minutes') newDate = setMinutes(selectedDate, val);
    onChange(newDate.toISOString());
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-100">
        <button
          type="button"
          onClick={() => setShowTime(false)}
          className={cn(
            "flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors",
            !showTime ? "text-blue-600 bg-blue-50/50" : "text-slate-500 hover:bg-slate-50"
          )}
        >
          <CalendarIcon className="w-4 h-4" />
          Ngày
        </button>
        <button
          type="button"
          onClick={() => setShowTime(true)}
          className={cn(
            "flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors",
            showTime ? "text-blue-600 bg-blue-50/50" : "text-slate-500 hover:bg-slate-50"
          )}
        >
          <Clock className="w-4 h-4" />
          Giờ
        </button>
      </div>

      <div className="p-4">
        {!showTime ? (
          /* Calendar View */
          <div className="animate-in fade-in slide-in-from-left-2 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-900 capitalize">
                {format(viewDate, 'MMMM yyyy', { locale: vi })}
              </h4>
              <div className="flex gap-1">
                <button type="button" onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-lg">
                  <ChevronLeft className="w-5 h-5 text-slate-600" />
                </button>
                <button type="button" onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-lg">
                  <ChevronRight className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
                <span key={d} className="text-[10px] font-bold text-slate-400 uppercase">
                  {d}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleDateClick(day)}
                  className={cn(
                    "aspect-square flex items-center justify-center text-sm rounded-xl transition-all",
                    !isSameMonth(day, monthStart) ? "text-slate-300" : "text-slate-700 hover:bg-blue-50",
                    isSameDay(day, selectedDate) && "bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-md shadow-blue-600/20",
                    isSameDay(day, new Date()) && !isSameDay(day, selectedDate) && "border border-blue-200 text-blue-600"
                  )}
                >
                  {format(day, 'd')}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  handleDateClick(today);
                  setViewDate(today);
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Chọn hôm nay
              </button>
            </div>
          </div>
        ) : (
          /* Time View */
          <div className="animate-in fade-in slide-in-from-right-2 duration-200">
            <div className="flex items-center justify-center gap-8 py-4">
              {/* Hours Scroll */}
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Giờ</span>
                <div className="h-40 overflow-y-auto scrollbar-hide space-y-1 px-2">
                  {hours.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleTimeChange('hours', h)}
                      className={cn(
                        "w-10 h-10 flex items-center justify-center rounded-xl text-sm transition-all",
                        getHours(selectedDate) === h 
                          ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20" 
                          : "text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      {h.toString().padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-2xl font-bold text-slate-300 self-center mt-4">:</div>

              {/* Minutes Scroll */}
              <div className="text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Phút</span>
                <div className="h-40 overflow-y-auto scrollbar-hide space-y-1 px-2">
                  {minutes.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleTimeChange('minutes', m)}
                      className={cn(
                        "w-10 h-10 flex items-center justify-center rounded-xl text-sm transition-all",
                        getMinutes(selectedDate) === m 
                          ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20" 
                          : "text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      {m.toString().padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-slate-50 rounded-xl text-center">
              <p className="text-xs text-slate-500 mb-1">Thời gian đã chọn:</p>
              <p className="text-lg font-bold text-slate-900">
                {format(selectedDate, 'HH:mm - dd/MM/yyyy', { locale: vi })}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
