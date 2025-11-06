export interface Employee {
  id: string; // uuid
  first_name: string;
  last_name: string;
  email?: string | null;
  phone_number?: string | null;
  hire_date?: string | null;
  birth_date?: string | null;
  avatar?: string | null;
  position_id?: string | null;
  department_id?: string | null;
  status?: string | null;
  created_at?: string;
  user_id?: string | null;
  salary?: number | null;
}

// Simplified type for the logged-in user state
export interface LoggedInEmployee {
  id: string;
  name: string;
  salary?: number | null;
}

export interface WorkLog {
  id: string; // uuid
  employee_id: string;
  date: string;
  task_description: string;
  hours_logged: number;
  created_at: string;
}