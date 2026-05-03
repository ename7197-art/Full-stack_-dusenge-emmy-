import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EmployeeForm from '../components/EmployeeForm';
import DepartmentForm from '../components/DepartmentForm';
import SalaryForm from '../components/SalaryForm';
import SalaryList from '../components/SalaryList';
import MonthlyReport from '../components/MonthlyReport';

export default function Dashboard({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const logout = async () => {
    await fetch('http://localhost:5000/api/auth/logout', { method: 'POST', credentials: 'include' });
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div>
      <Navbar logout={logout} />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<EmployeeForm />} />
          <Route path="/employees" element={<EmployeeForm />} />
          <Route path="/departments" element={<DepartmentForm />} />
          <Route path="/salaries" element={<SalaryForm />} />
          <Route path="/salary-list" element={<SalaryList />} />
          <Route path="/reports" element={<MonthlyReport />} />
        </Routes>
      </div>
    </div>
  );
}