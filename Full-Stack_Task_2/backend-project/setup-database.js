const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'PSSMS',
    port: process.env.DB_PORT || 3306,
  });

  try {
    // Create database if it doesn't exist
    await connection.execute('CREATE DATABASE IF NOT EXISTS PSSMS');
    
    // Switch to PSSMS database
    await connection.execute('USE PSSMS');

    // Drop existing tables if they exist
    await connection.execute('DROP TABLE IF EXISTS Users');
    await connection.execute('DROP TABLE IF EXISTS Car');
    await connection.execute('DROP TABLE IF EXISTS ParkingSlot');
    await connection.execute('DROP TABLE IF EXISTS ParkingRecord');
    await connection.execute('DROP TABLE IF EXISTS Payment');

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

    // Create Car table
    await connection.execute(`
      CREATE TABLE Car (
        PlateNumber VARCHAR(20) PRIMARY KEY,
        DriverName VARCHAR(100) NOT NULL,
        PhoneNumber VARCHAR(20) NOT NULL
      )
    `);

    // Create ParkingSlot table
    await connection.execute(`
      CREATE TABLE ParkingSlot (
        SlotNumber VARCHAR(10) PRIMARY KEY,
        SlotStatus ENUM('Available', 'Occupied') DEFAULT 'Available'
      )
    `);

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

    // Insert sample parking slots
    const slots = [];
    for (let i = 1; i <= 20; i++) {
      slots.push([`A${i}`, 'Available']);
    }
    await connection.query(
      'INSERT INTO ParkingSlot (SlotNumber, SlotStatus) VALUES ?',
      [slots]
    );

    // Create admin user with properly hashed password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.execute(
      'INSERT INTO Users (Username, Password, Role) VALUES (?, ?, ?)',
      ['admin', hashedPassword, 'admin']
    );

    // Create indexes for better performance
    await connection.execute('CREATE INDEX idx_parking_record_entry_time ON ParkingRecord(EntryTime)');
    await connection.execute('CREATE INDEX idx_parking_record_plate ON ParkingRecord(PlateNumber)');
    await connection.execute('CREATE INDEX idx_payment_date ON Payment(PaymentDate)');

    console.log('Database setup completed successfully!');
    console.log('Admin user created: username=admin, password=admin123');

  } catch (error) {
    console.error('Database setup failed:', error);
  } finally {
    await connection.end();
  }
}

setupDatabase();
