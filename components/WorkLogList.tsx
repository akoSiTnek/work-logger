import React from 'react';
import { WorkLog } from '../types';
import { CalendarIcon, ClockIcon, TrashIcon } from './icons';
import { Card, CardContent } from './ui/Card';
import { cn } from '../lib/utils';

interface WorkLogListProps {
  workLogs: WorkLog[];
  loading: boolean;
  onDelete: (logId: string) => void;
}

const LogItem: React.FC<{ log: WorkLog; onDelete: (logId: string) => void }> = ({ log, onDelete }) => {
  const displayDate = new Date(log.date + 'T00:00:00'); // Ensure date is parsed as local
  
  const statusConfig = {
    pending: {
      cardClasses: 'bg-amber-100 border-amber-200 text-slate-800',
      pillClasses: 'bg-amber-200 text-amber-800 font-bold',
      hoverClasses: 'hover:bg-amber-200/80',
      text: 'Pending',
    },
    approved: {
      cardClasses: 'bg-green-100 border-green-200 text-slate-800',
      pillClasses: 'bg-green-200 text-green-800 font-bold',
      hoverClasses: 'hover:bg-green-200/80',
      text: 'Approved',
    },
    denied: {
      cardClasses: 'bg-red-100 border-red-200 text-slate-800',
      pillClasses: 'bg-red-200 text-red-800 font-bold',
      hoverClasses: 'hover:bg-red-200/80',
      text: 'Denied',
    },
  };

  const currentStatus = statusConfig[log.status] || statusConfig.pending;
  
  return (
    <Card className={cn("group", currentStatus.cardClasses)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between text-sm mb-2 flex-wrap gap-y-2">
            <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5">
                <CalendarIcon className="h-4 w-4" />
                <span>{displayDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
                <span className={cn('px-2.5 py-1 rounded-full text-xs', currentStatus.pillClasses)}>
                    {currentStatus.text}
                </span>
            </div>
            <div className="flex items-center space-x-1.5 font-bold">
              <ClockIcon className="h-4 w-4" />
              <span>{log.hours_logged} hrs</span>
            </div>
        </div>
        <div className="flex items-start justify-between gap-4 pt-1">
            <p className="text-sm whitespace-pre-wrap flex-grow">{log.task_description}</p>
            <button
                onClick={() => onDelete(log.id)}
                className={cn(
                    "p-1.5 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all flex-shrink-0 -mt-1",
                    currentStatus.hoverClasses
                )}
                aria-label="Delete log"
            >
                <TrashIcon className="h-4 w-4" />
            </button>
        </div>
      </CardContent>
    </Card>
  );
};


const WorkLogList: React.FC<WorkLogListProps> = ({ workLogs, loading, onDelete }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading logs...</p>
      </div>
    );
  }

  return (
    <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Logs</h2>
        {workLogs.length > 0 ? (
        <div className="space-y-4">
            {workLogs.map(log => (
              <LogItem key={log.id} log={log} onDelete={onDelete} />
            ))}
        </div>
        ) : (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">No work logs recorded yet.</p>
            <p className="text-muted-foreground/80 text-sm mt-1">Add a new log to get started.</p>
        </div>
        )}
    </div>
  );
};

export default WorkLogList;