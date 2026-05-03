import React, { useState, useEffect } from 'react';
import { parkingRecordAPI, carAPI, parkingSlotAPI } from '../services/api';
import { ParkingRecord, Car, ParkingSlot } from '../types';

const ParkingRecordManagement: React.FC = () => {
  const [records, setRecords] = useState<ParkingRecord[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    PlateNumber: '',
    SlotNumber: '',
    EntryTime: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recordsRes, carsRes, slotsRes] = await Promise.all([
        parkingRecordAPI.getAll(),
        carAPI.getAll(),
        parkingSlotAPI.getAll(),
      ]);
      
      setRecords(recordsRes.data);
      setCars(carsRes.data);
      setSlots(slotsRes.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await parkingRecordAPI.create({
        PlateNumber: formData.PlateNumber,
        SlotNumber: formData.SlotNumber,
        EntryTime: formData.EntryTime || new Date().toISOString(),
      });
      
      setFormData({ PlateNumber: '', SlotNumber: '', EntryTime: '' });
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create parking record');
    } finally {
      setLoading(false);
    }
  };

  const handleExit = async (recordId: number) => {
    if (!window.confirm('Mark this car as exited?')) return;

    try {
      await parkingRecordAPI.updateExit(recordId);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update parking record');
    }
  };

  const resetForm = () => {
    setFormData({ PlateNumber: '', SlotNumber: '', EntryTime: '' });
    setShowForm(false);
    setError('');
  };

  const activeRecords = records.filter(record => !record.ExitTime);
  const completedRecords = records.filter(record => record.ExitTime);

  const availableSlots = slots.filter(slot => slot.SlotStatus === 'Available');

  if (loading && records.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading parking records...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Parking Record Management</h2>
        <p className="mt-2 text-gray-600">Manage car entries and exits</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🚗</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Parking
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">{activeRecords.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✓</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed Today
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">{completedRecords.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🅿️</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Available Slots
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">{availableSlots.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => setShowForm(true)}
          disabled={availableSlots.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {availableSlots.length === 0 ? 'No Available Slots' : 'Record Car Entry'}
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900">Record Car Entry</h3>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Select Car
                  </label>
                  <select
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.PlateNumber}
                    onChange={(e) => setFormData({ ...formData, PlateNumber: e.target.value })}
                  >
                    <option value="">Select a car</option>
                    {cars.map((car) => (
                      <option key={car.PlateNumber} value={car.PlateNumber}>
                        {car.PlateNumber} - {car.DriverName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Select Parking Slot
                  </label>
                  <select
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.SlotNumber}
                    onChange={(e) => setFormData({ ...formData, SlotNumber: e.target.value })}
                  >
                    <option value="">Select a slot</option>
                    {availableSlots.map((slot) => (
                      <option key={slot.SlotNumber} value={slot.SlotNumber}>
                        {slot.SlotNumber}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Entry Time
                  </label>
                  <input
                    type="datetime-local"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.EntryTime}
                    onChange={(e) => setFormData({ ...formData, EntryTime: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for current time</p>
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
                    {loading ? 'Recording...' : 'Record Entry'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Active Parking Records */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Active Parking ({activeRecords.length})</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {activeRecords.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              No active parking records
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {activeRecords.map((record) => (
                <li key={record.RecordID} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {record.PlateNumber} - Slot {record.SlotNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        Driver: {record.DriverName} | Entry: {new Date(record.EntryTime).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Duration: {Math.floor((Date.now() - new Date(record.EntryTime).getTime()) / (1000 * 60 * 60))} hours
                      </p>
                    </div>
                    <button
                      onClick={() => handleExit(record.RecordID)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                    >
                      Mark Exit
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Completed Parking Records */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Completed Parking ({completedRecords.length})</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {completedRecords.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              No completed parking records today
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {completedRecords.map((record) => (
                <li key={record.RecordID} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {record.PlateNumber} - Slot {record.SlotNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        Driver: {record.DriverName}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Entry: {new Date(record.EntryTime).toLocaleString()} | 
                        Exit: {new Date(record.ExitTime!).toLocaleString()} | 
                        Duration: {record.Duration} hours
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Completed
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParkingRecordManagement;
