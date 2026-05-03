const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function completeDatabaseSetup() {
  let connection;
  
  try {
    // Connect to MySQL without database first
    connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        port: process.env.DB_PORT || 3306,
        multipleStatements: true,
      });

    console.log('✅ Connected to MySQL server successfully');

    // Create database if it doesn't exist
    await connection.execute('CREATE DATABASE IF NOT EXISTS PSSMS');
    console.log('✅ Database PSSMS created or already exists');
    
    // Switch to PSSMS database
    await connection.changeUser({ database: 'PSSMS' });
    console.log('✅ Switched to PSSMS database');

    // Drop existing tables if they exist
    await connection.execute('DROP TABLE IF EXISTS Users');
    await connection.execute('DROP TABLE IF EXISTS Car');
    await connection.execute('DROP TABLE IF EXISTS ParkingSlot');
    await connection.execute('DROP TABLE IF EXISTS ParkingRecord');
    await connection.execute('DROP TABLE IF EXISTS Payment');
    console.log('✅ Dropped existing tables');

    // Create Users table
    await connection.execute(`
      CREATE TABLE Users (
        UserID INT AUTO_INCREMENT PRIMARY KEY,
        Username VARCHAR(50) NOT NULL UNIQUE,
        Password VARCHAR(255) NOT NULL,
        Role ENUM('admin', 'manager') DEFAULT 'manager',
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created Users table');

    // Create Car table
    await connection.execute(`
      CREATE TABLE Car (
        PlateNumber VARCHAR(20) PRIMARY KEY,
        DriverName VARCHAR(100) NOT NULL,
        PhoneNumber VARCHAR(20) NOT NULL
      )
    `);
    console.log('✅ Created Car table');

    // Create ParkingSlot table
    await connection.execute(`
      CREATE TABLE ParkingSlot (
        SlotNumber VARCHAR(10) PRIMARY KEY,
        SlotStatus ENUM('Available', 'Occupied') DEFAULT 'Available'
      )
    `);
    console.log('✅ Created ParkingSlot table');

    // Create ParkingRecord table
    await connection.execute(`
      CREATE TABLE ParkingRecord (
        RecordID INT AUTO_INCREMENT PRIMARY KEY,
        PlateNumber VARCHAR(20) NOT NULL,
        SlotNumber VARCHAR(10) NOT NULL,
        EntryTime DATETIME NOT NULL,
        ExitTime DATETIME,
        Duration DECIMAL(10,2),
        FOREIGN KEY (PlateNumber) REFERENCES Car(PlateNumber),
        FOREIGN KEY (SlotNumber) REFERENCES ParkingSlot(SlotNumber)
      )
    `);
    console.log('✅ Created ParkingRecord table');

    // Create Payment table
    await connection.execute(`
      CREATE TABLE Payment (
        PaymentID INT AUTO_INCREMENT PRIMARY KEY,
        RecordID INT NOT NULL UNIQUE,
        AmountPaid DECIMAL(10,2) NOT NULL,
        PaymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (RecordID) REFERENCES ParkingRecord(RecordID)
      )
    `);
    console.log('✅ Created Payment table');

    // Insert sample parking slots
    const slots = [];
    for (let i = 1; i <= 20; i++) {
      slots.push([`A${i}`, 'Available']);
    }
    await connection.query(
      'INSERT INTO ParkingSlot (SlotNumber, SlotStatus) VALUES ?',
      [slots]
    );
    console.log('✅ Inserted 20 sample parking Slots');

    // Create admin user with properly hashed password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.execute(
      'INSERT INTO Users (Username, Password, Role) VALUES (?, ?, ?)',
      ['admin', hashedPassword, 'admin']
    );
    console.log('✅ Created admin user with hashed password');

    // Create indexes for better performance
    await connection.execute('CREATE INDEX idx_parking_record_entry_time ON ParkingRecord(EntryTime)');
    await connection.execute('CREATE INDEX idx_parking_record_plate ON ParkingRecord(PlateNumber)');
    await connection.execute('CREATE INDEX idx_payment_date ON Payment(PaymentDate)');
    console.log('✅ Created database indexes');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('✅ Admin user created: username=admin, password=admin123');
    console.log('\n📱 Access Information:');
    console.log('🔐 Login Credentials: admin / admin123');
    console.log('🌐 Frontend URL: http://localhost:3003');
    console.log('🔗 Backend URL: http://localhost:5000');
    console.log('\n🚀 System is ready for use!');
    console.log('\n💡 Now you can login to the SmartPark PSSMS application!');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.error('\n💡 Troubleshooting tips:');
    console.error('1. Make sure MySQL server is running');
    console.error('2. Check database credentials in .env file');
    console.error('3. Verify MySQL socket path');
    console.error('4. Try: sudo service mysql status');
    console.error('5. Check if MySQL port 3306 is accessible');
  } finally {
    if (connection) {
      await connection.end();
      console.log('📦 Database connection closed');
    }
  }
}

completeDatabaseSetup();
