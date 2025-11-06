import React, { useState, useEffect } from 'react';
import { LoggedInEmployee } from './types';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { supabase } from './services/supabase';

const App: React.FC = () => {
  const [loggedInEmployee, setLoggedInEmployee] = useState<LoggedInEmployee | null>(null);

  useEffect(() => {
    // Check for a saved session in localStorage when the app loads
    try {
      const storedEmployee = localStorage.getItem('loggedInEmployee');
      if (storedEmployee) {
        setLoggedInEmployee(JSON.parse(storedEmployee));
      }
    } catch (error) {
      console.error("Failed to parse stored employee data:", error);
      // Clear corrupted data
      localStorage.removeItem('loggedInEmployee');
    }
  }, []);

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
      const employeeData = {
          id: employee.id,
          name: `${employee.first_name} ${employee.last_name}`,
          salary: employee.salary,
      };
      setLoggedInEmployee(employeeData);
      // Save session to localStorage
      localStorage.setItem('loggedInEmployee', JSON.stringify(employeeData));
      return true;
    }

    return false;
  };

  const handleLogout = () => {
    setLoggedInEmployee(null);
    // Clear session from localStorage
    localStorage.removeItem('loggedInEmployee');
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