import { useState, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  parseISO
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CalendarPickerProps {
  availableDates: string[];
  selectedDates: string[];
  onChange: (date: string) => void;
  voteType: 'available' | 'maybe';
}

export default function CalendarPicker({ 
  availableDates, 
  selectedDates, 
  onChange,
  voteType
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // availableDates가 로드되면 첫 번째 가능 날짜의 월로 이동
  useEffect(() => {
    if (availableDates.length > 0) {
      setCurrentMonth(parseISO(availableDates[0]));
    }
  }, [availableDates]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-800">
          {format(currentMonth, 'yyyy년 M월', { locale: ko })}
        </h3>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={prevMonth}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            type="button"
            onClick={nextMonth}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-bold text-slate-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, idx) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isAvailable = availableDates.includes(dateStr);
          const isSelected = selectedDates.includes(dateStr);
          const isCurrentMonth = isSameMonth(day, monthStart);

          return (
            <button
              key={idx}
              type="button"
              disabled={!isAvailable}
              onClick={() => isAvailable && onChange(dateStr)}
              className={cn(
                "relative h-14 sm:h-16 flex flex-col items-center justify-center rounded-2xl text-lg font-bold transition-all",
                !isCurrentMonth && "text-slate-200",
                isAvailable ? "hover:scale-105" : "opacity-30 cursor-not-allowed",
                isAvailable && !isSelected && "bg-white border-2 border-slate-50 text-slate-700",
                isSelected && voteType === 'available' && "bg-secondary text-slate-800 shadow-md",
                isSelected && voteType === 'maybe' && "bg-accent text-slate-800 shadow-md",
                !isAvailable && isCurrentMonth && "text-slate-300"
              )}
            >
              <span>{format(day, 'd')}</span>
              {isSelected && (
                <div className="absolute top-1 right-1">
                  <Check size={14} className="text-slate-700" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
