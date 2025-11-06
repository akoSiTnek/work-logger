import React from 'react';
import { WorkLog } from '../types';
import { CalendarIcon, ClockIcon, TrashIcon } from './icons';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface WorkLogListProps {
  workLogs: WorkLog[];
  loading: boolean;
  onDelete: (logId: string) => void;
}

const LogItem: React.FC<{ log: WorkLog; onDelete: (logId: string) => void }> = ({ log, onDelete }) => {
  const displayDate = new Date(log.date + 'T00:00:00'); // Ensure date is parsed as local
  return (
    <div className="py-4 border-b border-border last:pb-0 last:border-0 group relative">
       <button
        onClick={() => onDelete(log.id)}
        className="absolute top-3 right-2 p-1.5 text-muted-foreground/50 rounded-full hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
        aria-label="Delete log"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
        <div className="flex items-center space-x-1.5">
          <CalendarIcon className="h-4 w-4" />
          <span>{displayDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center space-x-1.5 font-medium text-foreground">
          <ClockIcon className="h-4 w-4" />
          <span>{log.hours_logged} hrs</span>
        </div>
      </div>
      <p className="text-sm text-foreground/80 whitespace-pre-wrap pr-8">{log.task_description}</p>
    </div>
  );
};


const WorkLogList: React.FC<WorkLogListProps> = ({ workLogs, loading, onDelete }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading logs...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Logs</CardTitle>
      </CardHeader>
      <CardContent>
        {workLogs.length > 0 ? (
          <div>
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
      </CardContent>
    </Card>
  );
};

export default WorkLogList;