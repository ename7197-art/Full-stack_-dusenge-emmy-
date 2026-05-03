import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from './api';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import DepartmentForm from './components/DepartmentForm';
import SalaryForm from './components/SalaryForm';
import SalaryList from './components/SalaryList';
import Reports from './components/MonthlyReport';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/auth/check');
                setLoggedIn(res.data.loggedIn);
            } catch (error) {
                console.error('Auth check failed:', error);
                setLoggedIn(false);
            }
        };
        
        checkAuth();
    }, []);

    const handleLogin = () => {
        setLoggedIn(true);
        // Re-check authentication status after login
        api.get('/auth/check').then(res => setLoggedIn(res.data.loggedIn));
    };

    const handleRegisterSuccess = () => {
        setLoggedIn(true);
        // Check authentication status after registration
        api.get('/auth/check').then(res => setLoggedIn(res.data.loggedIn));
    };

    if (!loggedIn) {
        if (showRegister) {
            return <Register onRegisterSuccess={handleRegisterSuccess} />;
        }
        return <Login onLogin={handleLogin} onShowRegister={() => setShowRegister(true)} />;
    }

    return (
        <BrowserRouter>
            <Navbar />
            <div className="container mx-auto">
                <Routes>
                    <Route path="/employees" element={<EmployeeForm />} />
                    <Route path="/employee-list" element={<EmployeeList />} />
                    <Route path="/departments" element={<DepartmentForm />} />
                    <Route path="/salaries" element={<SalaryForm onSalaryAdded={() => {}} />} />
                    <Route path="/salary-list" element={<SalaryList />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/" element={<Navigate to="/employees" />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;