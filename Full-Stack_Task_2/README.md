# Parking Space Sales Management System (PSSMS)

A comprehensive web-based parking management system for SmartPark company in Rubavu District, Rwanda. This system automates the manual paper-based parking management process, enabling efficient tracking of parking spaces, automatic fee calculation, and real-time reporting.

## Features

- **Car Management**: Register and manage vehicle information with driver details
- **Parking Slot Management**: Monitor parking slot availability in real-time
- **Parking Records**: Track vehicle entry and exit times automatically
- **Payment Processing**: Automatic calculation of parking fees (500 RWF/hour)
- **Bill Generation**: Generate detailed parking bills with all transaction details
- **Daily Reports**: Export daily payment reports with comprehensive statistics
- **User Authentication**: Secure session-based login system with encrypted passwords
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MySQL** database with optimized schema
- **bcryptjs** for password encryption
- **express-session** for session management
- **CORS** for cross-origin requests

### Frontend
- **React.js** with TypeScript
- **Tailwind CSS** for responsive UI design
- **Axios** for API communication
- **React Router** for navigation

## Database Schema

The system uses four main entities:

1. **ParkingSlot** (SlotNumber, SlotStatus)
2. **Car** (PlateNumber, DriverName, PhoneNumber)
3. **ParkingRecord** (RecordID, PlateNumber, SlotNumber, EntryTime, ExitTime, Duration)
4. **Payment** (PaymentID, RecordID, AmountPaid, PaymentDate)

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

### Database Setup

1. Create the database and tables using the provided SQL script:
```bash
mysql -u root -p < database_schema.sql
```

2. Update database credentials in `backend-project/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=PSSMS
DB_PORT=3306
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend-project
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend-project
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Default Login Credentials

- **Username**: admin
- **Password**: admin123

## Usage

### 1. Car Management
- Add new vehicles with driver information
- Update driver details
- Delete vehicle records (if no parking records exist)

### 2. Parking Slot Management
- View real-time slot availability
- Add new parking slots
- Monitor occupied vs available slots

### 3. Parking Records
- Record vehicle entry with slot assignment
- Mark vehicle exit (automatically calculates duration)
- View active and completed parking sessions

### 4. Payment Processing
- Automatic fee calculation (500 RWF per hour)
- Process payments for completed parking sessions
- Generate detailed bills

### 5. Reports
- View daily transaction summaries
- Export reports to CSV format
- Track revenue and parking statistics

## Parking Fee Calculation

- **Rate**: 500 RWF per hour
- **Minimum charge**: 1 hour (even if parked for less than 1 hour)
- **Calculation**: Duration × 500 RWF

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication status

### Cars
- `GET /api/cars` - Get all cars
- `POST /api/cars` - Add new car
- `PUT /api/cars/:plateNumber` - Update car
- `DELETE /api/cars/:plateNumber` - Delete car

### Parking Slots
- `GET /api/parking-slots` - Get all parking slots
- `POST /api/parking-slots` - Add new parking slot

### Parking Records
- `GET /api/parking-records` - Get all parking records
- `POST /api/parking-records` - Create new parking record
- `PUT /api/parking-records/:recordId/exit` - Mark vehicle exit

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Process payment

### Reports
- `GET /api/reports/daily` - Get daily report
- `GET /api/bill/:recordId` - Generate bill

## Project Structure

```
Full-Stack_Task_2/
├── backend-project/
│   ├── config/
│   │   └── database.js
│   ├── node_modules/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend-project/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tailwind.config.js
├── database_schema.sql
├── ERD_Design.md
└── README.md
```

## Security Features

- Password encryption using bcryptjs
- Session-based authentication
- CORS protection
- SQL injection prevention (using parameterized queries)
- Input validation

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## Future Enhancements

- Multi-language support (Kinyarwanda, French, English)
- Advanced reporting with charts
- SMS notifications for drivers
- Mobile app development
- Integration with payment gateways
- License plate recognition system

## Support

For technical support or questions, please contact the development team.

---

**Developed for SmartPark, Rubavu District, Rwanda**
