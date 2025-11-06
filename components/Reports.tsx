import React, { useState, useEffect, useMemo } from 'react';
import { LoggedInEmployee, WorkLog } from '../types';
import { supabase } from '../services/supabase';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

interface ReportsProps {
  employee: LoggedInEmployee;
}

interface ReportStats {
  dailyHours: number;
  weeklyHours: number;
  monthlyHours: number;
  weeklySalary: number;
  monthlySalary: number;
}

// Date helpers
const getWeekRange = (date: Date) => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};

const getMonthRange = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
};

// Compact component for displaying stats in a list format
const StatRow: React.FC<{ label: string, value: string, note?: string }> = ({ label, value, note }) => (
    <div className="flex items-start justify-between py-4 border-b border-border last:border-b-0">
        <div>
            <p className="text-base font-medium text-foreground">{label}</p>
            {note && <p className="text-sm text-muted-foreground mt-1">{note}</p>}
        </div>
        <p className="text-2xl font-semibold text-foreground text-right whitespace-nowrap">{value}</p>
    </div>
);


const Reports: React.FC<ReportsProps> = ({ employee }) => {
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllLogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('work_logs')
        .select('*')
        .eq('employee_id', employee.id);

      if (error) {
        console.error('Error fetching logs for reports:', error);
      } else {
        setWorkLogs(data || []);
      }
      setLoading(false);
    };

    fetchAllLogs();
  }, [employee.id]);

  const stats: ReportStats = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const { start: startOfWeek, end: endOfWeek } = getWeekRange(today);
    const { start: startOfMonth, end: endOfMonth } = getMonthRange(today);

    // Total hours worked, regardless of status
    const dailyHours = workLogs
      .filter(log => log.date === todayStr)
      .reduce((sum, log) => sum + log.hours_logged, 0);

    const weeklyHours = workLogs
      .filter(log => {
        const logDate = new Date(log.date + 'T00:00:00');
        return logDate >= startOfWeek && logDate <= endOfWeek;
      })
      .reduce((sum, log) => sum + log.hours_logged, 0);

    const monthlyHours = workLogs
      .filter(log => {
        const logDate = new Date(log.date + 'T00:00:00');
        return logDate >= startOfMonth && logDate <= endOfMonth;
      })
      .reduce((sum, log) => sum + log.hours_logged, 0);
    
    // Approved hours for salary calculation
    const approvedWeeklyHours = workLogs
      .filter(log => {
        const logDate = new Date(log.date + 'T00:00:00');
        return logDate >= startOfWeek && logDate <= endOfWeek && log.status === 'approved';
      })
      .reduce((sum, log) => sum + log.hours_logged, 0);
    
    const approvedMonthlyHours = workLogs
      .filter(log => {
        const logDate = new Date(log.date + 'T00:00:00');
        return logDate >= startOfMonth && logDate <= endOfMonth && log.status === 'approved';
      })
      .reduce((sum, log) => sum + log.hours_logged, 0);
      
    // Assuming employee.salary is the daily rate and a standard 8-hour workday
    const hourlyRate = (employee.salary ?? 0) / 8;
    const weeklySalary = approvedWeeklyHours * hourlyRate;
    const monthlySalary = approvedMonthlyHours * hourlyRate;

    return { dailyHours, weeklyHours, monthlyHours, weeklySalary, monthlySalary };
  }, [workLogs, employee.salary]);

  if (loading) {
    return (
        <div className="flex items-center justify-center pt-16">
            <p className="text-muted-foreground">Loading reports...</p>
        </div>
    );
  }

  const salaryNotConfigured = !employee.salary || employee.salary === 0;

  return (
    <div className="space-y-6 -mx-4 sm:mx-0">
      <Card className="rounded-none sm:rounded-lg border-0 sm:border">
        <CardHeader className="px-4 sm:p-6">
          <CardTitle className="text-xl">Work Hours</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:p-6 pt-0">
            <StatRow label="Today" value={`${stats.dailyHours.toFixed(1)} hrs`} />
            <StatRow label="This Week" value={`${stats.weeklyHours.toFixed(1)} hrs`} />
            <StatRow label="This Month" value={`${stats.monthlyHours.toFixed(1)} hrs`} />
        </CardContent>
      </Card>
      
      <Card className="rounded-none sm:rounded-lg border-0 sm:border">
        <CardHeader className="px-4 sm:p-6">
            <CardTitle className="text-xl">Salary Estimates</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:p-6 pt-0">
            {salaryNotConfigured ? (
                <div className="text-center py-8">
                   <p className="text-base font-medium text-muted-foreground">Salary information not available.</p>
                   <p className="text-sm text-muted-foreground/80 mt-1">Estimates cannot be calculated.</p>
                </div>
            ) : (
                <>
                    <StatRow 
                        label="This Week" 
                        value={stats.weeklySalary.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })} 
                        note="Based on approved hours logged this week."
                    />
                    <StatRow 
                        label="This Month" 
                        value={stats.monthlySalary.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                        note="Based on approved hours logged this month."
                    />
                </>
            )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;