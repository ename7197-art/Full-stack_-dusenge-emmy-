import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Navbar from './components/Navbar';
import CarManagement from './components/CarManagement';
import ParkingSlotManagement from './components/ParkingSlotManagement';
import ParkingRecordManagement from './components/ParkingRecordManagement';
import PaymentManagement from './components/PaymentManagement';
import Reports from './components/Reports';
import { authAPI } from './services/api';
import { User } from './types';

type PageType = 'cars' | 'parking-slots' | 'parking-records' | 'payments' | 'reports';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('cars');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.checkAuth();
      if (response.data.authenticated) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'cars':
        return <CarManagement />;
      case 'parking-slots':
        return <ParkingSlotManagement />;
      case 'parking-records':
        return <ParkingRecordManagement />;
      case 'payments':
        return <PaymentManagement />;
      case 'reports':
        return <Reports />;
      default:
        return <CarManagement />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={user}
        onLogout={handleLogout}
        currentPage={currentPage}
        onNavigate={(page: PageType) => setCurrentPage(page)}
      />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default App;
