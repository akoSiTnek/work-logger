import * as React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import { usePopoverContext } from './Popover';

export interface CalendarProps {
  selected?: Date;
  onSelect: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selected, onSelect }) => {
  const { setOpen } = usePopoverContext();
  const [currentMonth, setCurrentMonth] = React.useState(selected || new Date());

  const handleSelectDate = (date: Date) => {
    onSelect(date);
    setOpen(false); // Close the popover on date selection
  };

  const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startDate = new Date(startOfMonth);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date(endOfMonth);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const days = [];
  let day = new Date(startDate);

  while (day <= endDate) {
    days.push(new Date(day));
    day.setDate(day.getDate() + 1);
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const isSameDay = (d1: Date, d2?: Date) => {
    if (!d2) return false;
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  };

  const isToday = (d: Date) => {
     const today = new Date();
     return isSameDay(d, today);
  }

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="space-x-1">
          <Button type="button" variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
        {weekDays.map(wd => <div key={wd}>{wd}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2">
        {days.map((d, index) => (
          <button
            type="button"
            key={index}
            onClick={() => handleSelectDate(d)}
            className={cn(
              'h-9 w-9 p-0 font-normal rounded-md text-sm',
              'hover:bg-accent hover:text-accent-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              d.getMonth() !== currentMonth.getMonth() && 'text-muted-foreground opacity-50',
              isSameDay(d, selected) && 'bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary',
              isToday(d) && !isSameDay(d, selected) && 'border border-input'
            )}
          >
            {d.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
};
Calendar.displayName = 'Calendar';

export { Calendar };