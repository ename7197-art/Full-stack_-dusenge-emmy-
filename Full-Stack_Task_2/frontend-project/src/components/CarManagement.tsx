import React, { useState, useEffect } from 'react';
import { carAPI } from '../services/api';
import { Car } from '../types';

const CarManagement: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState({
    PlateNumber: '',
    DriverName: '',
    PhoneNumber: '',
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await carAPI.getAll();
      setCars(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch cars');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingCar) {
        await carAPI.update(editingCar.PlateNumber, {
          DriverName: formData.DriverName,
          PhoneNumber: formData.PhoneNumber,
        });
      } else {
        await carAPI.create(formData);
      }
      
      setFormData({ PlateNumber: '', DriverName: '', PhoneNumber: '' });
      setShowForm(false);
      setEditingCar(null);
      fetchCars();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save car');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setFormData({
      PlateNumber: car.PlateNumber,
      DriverName: car.DriverName,
      PhoneNumber: car.PhoneNumber,
    });
    setShowForm(true);
  };

  const handleDelete = async (plateNumber: string) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;

    try {
      await carAPI.delete(plateNumber);
      fetchCars();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete car');
    }
  };

  const resetForm = () => {
    setFormData({ PlateNumber: '', DriverName: '', PhoneNumber: '' });
    setShowForm(false);
    setEditingCar(null);
    setError('');
  };

  if (loading && cars.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading cars...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Car Management</h2>
        <p className="mt-2 text-gray-600">Manage car information and driver details</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
        >
          Add New Car
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900">
                {editingCar ? 'Edit Car' : 'Add New Car'}
              </h3>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Plate Number
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingCar}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.PlateNumber}
                    onChange={(e) => setFormData({ ...formData, PlateNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Driver Name
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.DriverName}
                    onChange={(e) => setFormData({ ...formData, DriverName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.PhoneNumber}
                    onChange={(e) => setFormData({ ...formData, PhoneNumber: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Registered Cars ({cars.length})
          </h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {cars.length === 0 ? (
            <li className="px-4 py-4 text-center text-gray-500">
              No cars registered yet
            </li>
          ) : (
            cars.map((car) => (
              <li key={car.PlateNumber} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {car.PlateNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      Driver: {car.DriverName} | Phone: {car.PhoneNumber}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(car)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(car.PlateNumber)}
                      className="text-red-600 hover:text-red-900 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default CarManagement;
