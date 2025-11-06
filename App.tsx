import React, { useState } from 'react';
import { LoggedInEmployee } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [loggedInEmployee, setLoggedInEmployee] = useState<LoggedInEmployee | null>(null);

  const handleLogin = async (firstName: string): Promise<boolean> => {
    const { data: employees, error } = await supabase
      .from('employees')
      .select('id, first_name, last_name, salary')
      .ilike('first_name', firstName.trim())
      .limit(1);

    if (error) {
      console.error('Login error:', error);
      return false;
    }
    
    const employee = employees?.[0];

    if (employee) {
      setLoggedInEmployee({
          id: employee.id,
          name: `${employee.first_name} ${employee.last_name}`,
          salary: employee.salary,
      });
      return true;
    }

    return false;
  };

  const handleLogout = () => {
    setLoggedInEmployee(null);
  };

  return (
    <div className="min-h-screen">
      {loggedInEmployee ? (
        <Dashboard employee={loggedInEmployee} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;