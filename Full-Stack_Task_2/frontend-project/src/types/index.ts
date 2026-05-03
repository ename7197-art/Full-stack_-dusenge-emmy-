export interface User {
  id: number;
  username: string;
  role: 'admin' | 'manager';
}

export interface Car {
  PlateNumber: string;
  DriverName: string;
  PhoneNumber: string;
}

export interface ParkingSlot {
  SlotNumber: string;
  SlotStatus: 'Available' | 'Occupied';
}

export interface ParkingRecord {
  RecordID: number;
  PlateNumber: string;
  SlotNumber: string;
  EntryTime: string;
  ExitTime?: string;
  Duration?: number;
  DriverName?: string;
  PhoneNumber?: string;
  SlotStatus?: string;
}

export interface Payment {
  PaymentID: number;
  RecordID: number;
  AmountPaid: number;
  PaymentDate: string;
  PlateNumber?: string;
  EntryTime?: string;
  ExitTime?: string;
  Duration?: number;
  DriverName?: string;
}

export interface Bill {
  RecordID: number;
  PlateNumber: string;
  EntryTime: string;
  ExitTime: string;
  Duration: number;
  AmountPaid: number;
  PaymentDate: string;
  DriverName: string;
  PhoneNumber: string;
}

export interface DailyReport {
  date: string;
  transactions: Payment[];
  summary: {
    total_transactions: number;
    total_revenue: number;
    avg_duration: number;
  };
}
