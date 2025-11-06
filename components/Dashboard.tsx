import React, { useState, useEffect } from 'react';
import { LoggedInEmployee, WorkLog } from '../types';
import Header from './Header';
import WorkLogForm from './WorkLogForm';
import WorkLogList from './WorkLogList';
import Sidebar from './Sidebar';
import Reports from './Reports';
import { supabase } from '../services/supabase';
import { Button } from './ui/Button';
import { PlusIcon } from './icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
} from './ui/Dialog';

interface DashboardProps {
  employee: LoggedInEmployee;
  onLogout: () => void;
}

type View = 'list' | 'form' | 'reports';

const FORM_ID = 'add-work-log-form';
const VIEW_TITLES: Record<View, string> = {
  list: 'Dashboard',
  form: 'Add New Log',
  reports: 'Reports',
};

const Dashboard: React.FC<DashboardProps> = ({ employee, onLogout }) => {
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [view, setView] = useState<View>('list');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<string | null>(null);


  useEffect(() => {
    // Only fetch logs when the list view is active
    if (view === 'list') {
      const fetchLogs = async () => {
        setLoadingLogs(true);
        const { data, error } = await supabase
          .from('work_logs')
          .select('*')
          .eq('employee_id', employee.id)
          .order('date', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching work logs:', error);
        } else {
          setWorkLogs(data || []);
        }
        setLoadingLogs(false);
      };

      fetchLogs();
    }
  }, [employee.id, view]);

  const handleAddLog = async (newLogData: { date: string; hours: number; description: string }) => {
    const newLogToInsert = {
      employee_id: employee.id,
      date: newLogData.date,
      hours_logged: newLogData.hours,
      task_description: newLogData.description,
    };

    const { data, error } = await supabase
      .from('work_logs')
      .insert(newLogToInsert)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding work log:', error);
      alert('Failed to add work log. Please try again.');
    } else if (data) {
      // Prepend the new log if the user is on the list view
      if (view === 'list') {
        setWorkLogs(prevLogs => [data, ...prevLogs]);
      }
      setView('list'); // Switch back to the list view
    }
  };
  
  const handleDeleteRequest = (logId: string) => {
    setLogToDelete(logId);
  };

  const handleConfirmDelete = async () => {
    if (!logToDelete) return;

    const { error } = await supabase
      .from('work_logs')
      .delete()
      .eq('id', logToDelete);

    if (error) {
      console.error('Error deleting work log:', error);
      alert('Failed to delete work log. Please try again.');
    } else {
      setWorkLogs(prevLogs => prevLogs.filter(log => log.id !== logToDelete));
    }
    setLogToDelete(null); // Close the dialog
  };

  const handleCancelDelete = () => {
    setLogToDelete(null);
  };


  const handleNavigate = (newView: View) => {
    setView(newView);
    setSidebarOpen(false);
  };

  const renderContent = () => {
    switch (view) {
      case 'reports':
        return (
          <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <Reports employee={employee} />
          </div>
        );
      case 'form':
        return (
          <>
            <div className="flex-grow overflow-y-auto p-4">
              <div className="container mx-auto">
                <WorkLogForm onAddLog={handleAddLog} formId={FORM_ID} />
              </div>
            </div>
            <div className="p-4 border-t border-border bg-background sticky bottom-0">
              <div className="container mx-auto">
                <Button type="submit" form={FORM_ID} className="w-full">
                  Save Log
                </Button>
              </div>
            </div>
          </>
        );
      case 'list':
      default:
        return (
          <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <div className="flex justify-end items-center mb-6">
              <Button onClick={() => setView('form')}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add New Log
              </Button>
            </div>
            <WorkLogList workLogs={workLogs} loading={loadingLogs} onDelete={handleDeleteRequest} />
          </div>
        );
    }
  };

  return (
    <>
      <div className="flex h-screen bg-slate-50">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNavigate={handleNavigate}
          currentView={view}
          employeeName={employee.name}
          onLogout={onLogout}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            title={VIEW_TITLES[view]}
            view={view}
            onBack={() => setView('list')}
            onToggleSidebar={() => setSidebarOpen(true)}
          />
          <main className="flex-grow flex flex-col">
            {renderContent()}
          </main>
        </div>
      </div>

      <Dialog open={!!logToDelete}>
        <DialogOverlay onClick={handleCancelDelete}/>
        <DialogContent onEscapeKeyDown={handleCancelDelete} onCloseClick={handleCancelDelete}>
            <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete this work log entry.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={handleCancelDelete} className="mt-2 sm:mt-0">
                    Cancel
                </Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>
                    Delete
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Dashboard;
