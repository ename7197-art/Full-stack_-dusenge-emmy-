import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api';

export default function Navbar() {
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    
    const logout = async () => {
        if (isLoggingOut) return; // Prevent multiple clicks
        
        setIsLoggingOut(true);
        try {
            await api.post('/auth/logout');
            // Clear any stored auth state and redirect to login
            localStorage.removeItem('authState');
            sessionStorage.clear();
            navigate('/login');
            // Force page reload to clear all state
            window.location.reload();
        } catch (error) {
            console.error('Logout failed:', error);
            // Even if logout fails, still redirect to login
            navigate('/login');
            window.location.reload();
        }
    };
    return (
        <nav className="bg-gray-800 text-white p-4 flex flex-wrap justify-between">
            <div className="flex gap-4">
                <Link to="/employees" className="hover:underline">Employee</Link>
                <Link to="/employee-list" className="hover:underline">Employees List</Link>
                <Link to="/departments" className="hover:underline">Department</Link>
                <Link to="/salaries" className="hover:underline">Add Salary</Link>
                <Link to="/salary-list" className="hover:underline">Salary List</Link>
                <Link to="/reports" className="hover:underline">Reports</Link>
            </div>
            <button onClick={logout} disabled={isLoggingOut} className={`px-3 py-1 rounded ${isLoggingOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white`}>
                {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
        </nav>
    );
}