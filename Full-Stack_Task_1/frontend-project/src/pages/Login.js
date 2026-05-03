import { useState } from 'react';
import api from '../api';

export default function Login({ onLogin, onShowRegister }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validation
        if (!username.trim() || !password.trim()) {
            setError('Please enter both username and password');
            setIsLoading(false);
            return;
        }

        try {
            const res = await api.post('/auth/login', { username, password });
            if (res.data.success) {
                // Store login state
                localStorage.setItem('authState', 'true');
                localStorage.setItem('username', username);
                onLogin();
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            console.error('Login error:', err);
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else if (err.response?.status === 401) {
                setError('Invalid username or password');
            } else if (err.response?.status === 500) {
                setError('Server error. Please try again later.');
            } else {
                setError('Login failed. Please check your connection.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-fill for demo purposes
    const fillDemo = () => {
        setUsername('admin');
        setPassword('admin123');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Employee Management</h1>
                    <p className="text-gray-600">Please login to access the system</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input 
                            type="text" 
                            placeholder="Enter your username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            value={username} 
                            onChange={e => setUsername(e.target.value)} 
                            required 
                            disabled={isLoading}
                            autoComplete="username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input 
                            type="password" 
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                            disabled={isLoading}
                            autoComplete="current-password"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`w-full py-3 rounded-lg font-medium transition duration-200 ${
                            isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </span>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

                {/* Demo Account Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">
                        <strong>Demo Account:</strong>
                    </p>
                    <p className="text-xs text-blue-700 mb-1">Username: admin</p>
                    <p className="text-xs text-blue-700 mb-2">Password: admin123</p>
                    <button
                        type="button"
                        onClick={fillDemo}
                        disabled={isLoading}
                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition duration-200"
                    >
                        Fill Demo Credentials
                    </button>
                </div>

                {/* Register Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button 
                            onClick={onShowRegister}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Create Account
                        </button>
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-xs text-gray-500">
                    <p>© 2024 Employee Management System</p>
                </div>
            </div>
        </div>
    );
}