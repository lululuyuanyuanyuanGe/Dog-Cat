'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
}

export default function DatePicker({ value, onChange }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(value || new Date())); 
  const [viewMode, setViewMode] = useState<'calendar' | 'years'>('calendar');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setViewMode('calendar');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      // Fix timezone parsing by treating string as local date components
      const [y, m, d] = value.split('-').map(Number);
      setViewDate(new Date(y, m - 1, d));
    }
  }, [value]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const today = new Date();
  today.setHours(0,0,0,0);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleDayClick = (day: number) => {
    const selected = new Date(year, month, day);
    const formatted = `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, '0')}-${String(selected.getDate()).padStart(2, '0')}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const handleYearClick = (y: number) => {
      setViewDate(new Date(y, month, 1));
      setViewMode('calendar');
  };

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const renderDays = () => {
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    for (let d = 1; d <= totalDays; d++) {
      const currentDate = new Date(year, month, d);
      // Construct local comparison string
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      const isSelected = value === dateStr;
      const isToday = currentDate.getTime() === today.getTime();

      days.push(
        <button
          key={d}
          type="button"
          onClick={() => handleDayClick(d)}
          className={`
            h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-all
            ${isSelected 
              ? 'bg-coral text-white shadow-lg shadow-coral/30 scale-110' 
              : isToday 
                ? 'bg-coral/10 text-coral border border-coral/30' 
                : 'text-slate-600 hover:bg-slate-100'}
          `}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  const renderYears = () => {
      const years = [];
      const currentYear = new Date().getFullYear();
      const startYear = currentYear + 1; 
      const endYear = 1990;

      for (let y = startYear; y >= endYear; y--) {
          years.push(
              <button 
                key={y} 
                onClick={() => handleYearClick(y)}
                className={`p-2 rounded-lg text-sm font-bold ${y === year ? 'bg-coral text-white' : 'hover:bg-slate-100 text-slate-600'}`}
              >
                  {y}
              </button>
          )
      }
      return years;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center justify-between px-4 py-3 
          bg-white/50 border border-white/60 rounded-xl
          hover:bg-white/80 hover:border-coral/30 transition-all
          focus:ring-2 focus:ring-coral/20 outline-none group
          ${isOpen ? 'ring-2 ring-coral/20 border-coral/50 bg-white/90' : ''}
        `}
      >
        <span className="text-slate-600 font-mono text-sm tracking-wide">
          {value || "Select a date..."}
        </span>
        <CalendarIcon size={18} className="text-slate-400 group-hover:text-coral transition-colors" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-50 mt-2 w-full min-w-[300px] p-4 bg-white/95 backdrop-blur-xl border border-white/50 shadow-2xl rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <button 
                type="button" 
                onClick={handlePrevMonth} 
                className="p-1 hover:bg-slate-100 rounded-full text-slate-500 hover:text-coral transition-colors"
                disabled={viewMode === 'years'}
              >
                <ChevronLeft size={20} className={viewMode === 'years' ? 'opacity-0' : ''} />
              </button>
              
              <button 
                type="button"
                onClick={() => setViewMode(viewMode === 'calendar' ? 'years' : 'calendar')}
                className="font-display font-bold text-slate-700 text-lg hover:text-coral transition-colors flex items-center gap-1"
              >
                {viewMode === 'calendar' ? `${monthNames[month]} ${year}` : `Select Year`}
                <span className="text-[10px] text-slate-400 font-sans font-normal ml-1">
                    {viewMode === 'calendar' ? '▼' : '▲'}
                </span>
              </button>

              <button 
                type="button" 
                onClick={handleNextMonth} 
                className="p-1 hover:bg-slate-100 rounded-full text-slate-500 hover:text-coral transition-colors"
                disabled={viewMode === 'years'}
              >
                <ChevronRight size={20} className={viewMode === 'years' ? 'opacity-0' : ''} />
              </button>
            </div>

            {viewMode === 'calendar' ? (
                <>
                    <div className="grid grid-cols-7 mb-2 text-center">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                        <span key={day} className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {day}
                        </span>
                    ))}
                    </div>
                    <div className="grid grid-cols-7 gap-y-2 justify-items-center">
                    {renderDays()}
                    </div>
                </>
            ) : (
                <div className="grid grid-cols-4 gap-2 max-h-[250px] overflow-y-auto pr-1">
                    {renderYears()}
                </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}