import { useState } from 'react';
import api from '../api';

export default function Register({ onRegisterSuccess }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validation
        if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
            setError('Please fill in all required fields');
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (!formData.email.includes('@') || !formData.email.includes('.')) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            const res = await api.post('/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName,
                phone: formData.phone
            });

            if (res.data.success) {
                // Store registration info
                localStorage.setItem('registrationSuccess', 'true');
                localStorage.setItem('registeredUsername', formData.username);
                onRegisterSuccess();
            } else {
                setError(res.data.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Registration error:', err);
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else if (err.response?.status === 409) {
                setError('Username or email already exists');
            } else if (err.response?.status === 500) {
                setError('Server error. Please try again later.');
            } else {
                setError('Registration failed. Please check your connection.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const clearForm = () => {
        setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            fullName: '',
            phone: ''
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
                    <p className="text-gray-600">Join our Employee Management System</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Username *
                        </label>
                        <input 
                            type="text" 
                            name="username"
                            placeholder="Choose a username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                            value={formData.username} 
                            onChange={handleChange} 
                            required 
                            disabled={isLoading}
                            autoComplete="username"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <input 
                            type="email" 
                            name="email"
                            placeholder="your@email.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            disabled={isLoading}
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input 
                            type="text" 
                            name="fullName"
                            placeholder="John Doe"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                            value={formData.fullName} 
                            onChange={handleChange} 
                            disabled={isLoading}
                            autoComplete="name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <input 
                            type="tel" 
                            name="phone"
                            placeholder="+250 788 123 456"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                            value={formData.phone} 
                            onChange={handleChange} 
                            disabled={isLoading}
                            autoComplete="tel"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password *
                        </label>
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Min 6 characters"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            disabled={isLoading}
                            autoComplete="new-password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password *
                        </label>
                        <input 
                            type="password" 
                            name="confirmPassword"
                            placeholder="Re-enter password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                            value={formData.confirmPassword} 
                            onChange={handleChange} 
                            required 
                            disabled={isLoading}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className={`flex-1 py-3 rounded-lg font-medium transition duration-200 ${
                                isLoading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>

                        <button 
                            type="button"
                            onClick={clearForm}
                            disabled={isLoading}
                            className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition duration-200"
                        >
                            Clear
                        </button>
                    </div>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <button 
                            onClick={onRegisterSuccess}
                            className="text-green-600 hover:text-green-700 font-medium"
                        >
                            Sign In
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
