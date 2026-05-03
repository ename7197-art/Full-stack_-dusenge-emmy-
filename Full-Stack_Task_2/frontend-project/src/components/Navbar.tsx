import React from 'react';
import { User } from '../types';
import { authAPI } from '../services/api';

type PageType = 'cars' | 'parking-slots' | 'parking-records' | 'payments' | 'reports';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, currentPage, onNavigate }) => {
  const handleLogout = async () => {
    try {
      await authAPI.logout();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      onLogout(); // Still logout even if API call fails
    }
  };

  const menuItems = [
    { id: 'cars' as PageType, label: 'Cars', icon: '🚗' },
    { id: 'parking-slots' as PageType, label: 'Parking Slots', icon: '🅿️' },
    { id: 'parking-records' as PageType, label: 'Parking Records', icon: '📝' },
    { id: 'payments' as PageType, label: 'Payments', icon: '💰' },
    { id: 'reports' as PageType, label: 'Reports', icon: '📊' },
  ];

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold">SmartPark PSSMS</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      currentPage === item.id
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    } transition-colors duration-200`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="mr-4">
                <span className="text-sm">Welcome, {user.username}</span>
                <span className="ml-2 text-xs bg-gray-600 px-2 py-1 rounded">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                currentPage === item.id
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div className="border-t border-gray-700 pt-4 mt-4">
            <div className="px-3 py-2">
              <span className="text-sm">Welcome, {user.username}</span>
              <span className="ml-2 text-xs bg-gray-600 px-2 py-1 rounded">
                {user.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-700 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
