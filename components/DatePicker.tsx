import * as React from 'react';
import { CalendarIcon } from './icons';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';
import { Calendar } from './ui/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/Popover';

interface DatePickerProps {
  date?: Date;
  onDateChange: (date: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ date, onDateChange }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          type="button"
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? date.toLocaleDateString('en-CA') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
         <Calendar
          selected={date}
          onSelect={onDateChange}
        />
      </PopoverContent>
    </Popover>
  );
}