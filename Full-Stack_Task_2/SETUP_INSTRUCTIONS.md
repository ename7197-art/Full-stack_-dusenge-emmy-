# Setup Instructions for PSSMS

## Quick Start Guide

### 1. Database Setup

#### Option A: Using MySQL Command Line
```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source /path/to/database_schema.sql;
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Create new connection to your MySQL server
3. Open SQL editor
4. Copy and paste contents of `database_schema.sql`
5. Execute the script

### 2. Backend Configuration

1. Navigate to backend directory:
```bash
cd backend-project
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Copy the example .env file
cp .env.example .env

# Edit .env with your database credentials
nano .env
```

4. Update database settings in `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=PSSMS
DB_PORT=3306
PORT=5000
SESSION_SECRET=your-secret-key-here
```

5. Start backend server:
```bash
npm start
```

### 3. Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend-project
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

### 4. Access the Application

1. Open your browser and go to: `http://localhost:3000`
2. Login with default credentials:
   - Username: `admin`
   - Password: `admin123`

## Troubleshooting

### Common Issues

#### Database Connection Error
- Ensure MySQL server is running
- Check database credentials in `.env` file
- Verify database name is `PSSMS`
- Make sure user has proper permissions

#### Port Already in Use
- Change port in `.env` file (backend) or use different port for frontend
- Kill existing processes using the port

#### Frontend Not Loading
- Check if backend server is running on port 5000
- Verify CORS settings in backend
- Check browser console for errors

#### Tailwind CSS Not Working
- Ensure Tailwind directives are in `index.css`
- Check `tailwind.config.js` configuration
- Restart development server

### Database Issues

#### Reset Database
```sql
DROP DATABASE IF EXISTS PSSMS;
CREATE DATABASE PSSMS;
-- Run the schema file again
```

#### Check Tables
```sql
USE PSSMS;
SHOW TABLES;
DESCRIBE Car;
DESCRIBE ParkingSlot;
DESCRIBE ParkingRecord;
DESCRIBE Payment;
```

### Backend Issues

#### Check Server Logs
```bash
# View server output
npm start

# Check for database connection errors
# Check for missing dependencies
```

#### Test API Endpoints
```bash
# Test health endpoint
curl http://localhost:5000/api/auth/check

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Frontend Issues

#### Clear Browser Cache
- Clear browser data
- Hard refresh (Ctrl+F5)
- Try incognito mode

#### Check Network Requests
- Open browser developer tools
- Go to Network tab
- Check for failed API calls
- Verify CORS headers

## Development Tips

### Backend Development
- Use `npm run dev` for development with auto-restart
- Check `server.js` for API routes
- Modify `config/database.js` for database settings

### Frontend Development
- Components are in `src/components/`
- API calls are in `src/services/api.ts`
- TypeScript types are in `src/types/index.ts`

### Database Modifications
- Update `database_schema.sql`
- Restart backend server
- Clear browser cache

## Production Deployment

### Backend Production Setup
1. Set production environment variables
2. Use process manager (PM2)
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates

### Frontend Production Setup
1. Build the application: `npm run build`
2. Serve static files
3. Configure production server

### Database Production
1. Create production database user
2. Set proper permissions
3. Enable backup system
4. Monitor performance

## Security Considerations

1. Change default admin password
2. Use strong session secrets
3. Enable HTTPS in production
4. Regular database backups
5. Monitor access logs

## Performance Optimization

1. Database indexing
2. API response caching
3. Frontend code splitting
4. Image optimization
5. CDN usage

---

For additional support, refer to the main README.md file or contact the development team.
