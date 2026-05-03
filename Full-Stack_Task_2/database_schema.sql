-- PSSMS Database Schema
-- Parking Space Sales Management System

-- Create Database
CREATE DATABASE IF NOT EXISTS PSSMS;
USE PSSMS;

-- 1. ParkingSlot Table
CREATE TABLE ParkingSlot (
    SlotNumber VARCHAR(10) PRIMARY KEY,
    SlotStatus ENUM('Available', 'Occupied') DEFAULT 'Available'
);

-- 2. Car Table
CREATE TABLE Car (
    PlateNumber VARCHAR(20) PRIMARY KEY,
    DriverName VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(20) NOT NULL
);

-- 3. ParkingRecord Table
CREATE TABLE ParkingRecord (
    RecordID INT AUTO_INCREMENT PRIMARY KEY,
    PlateNumber VARCHAR(20) NOT NULL,
    SlotNumber VARCHAR(10) NOT NULL,
    EntryTime DATETIME NOT NULL,
    ExitTime DATETIME,
    Duration DECIMAL(10,2), -- Duration in hours
    FOREIGN KEY (PlateNumber) REFERENCES Car(PlateNumber),
    FOREIGN KEY (SlotNumber) REFERENCES ParkingSlot(SlotNumber)
);

-- 4. Payment Table
CREATE TABLE Payment (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    RecordID INT NOT NULL UNIQUE,
    AmountPaid DECIMAL(10,2) NOT NULL,
    PaymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RecordID) REFERENCES ParkingRecord(RecordID)
);

-- 5. Users Table for Authentication
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL, -- Will store hashed password
    Role ENUM('admin', 'manager') DEFAULT 'manager',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample parking slots (A1-A20)
INSERT INTO ParkingSlot (SlotNumber, SlotStatus) VALUES
('A1', 'Available'), ('A2', 'Available'), ('A3', 'Available'), ('A4', 'Available'), ('A5', 'Available'),
('A6', 'Available'), ('A7', 'Available'), ('A8', 'Available'), ('A9', 'Available'), ('A10', 'Available'),
('A11', 'Available'), ('A12', 'Available'), ('A13', 'Available'), ('A14', 'Available'), ('A15', 'Available'),
('A16', 'Available'), ('A17', 'Available'), ('A18', 'Available'), ('A19', 'Available'), ('A20', 'Available');

-- Create default admin user (password: admin123)
INSERT INTO Users (Username, Password, Role) VALUES
('admin', '$2b$10$XQYzJ2zK2Z2Z2Z2Z2Z2Z2OZ2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2', 'admin');

-- Create indexes for better performance
CREATE INDEX idx_parking_record_entry_time ON ParkingRecord(EntryTime);
CREATE INDEX idx_parking_record_plate ON ParkingRecord(PlateNumber);
CREATE INDEX idx_payment_date ON Payment(PaymentDate);

-- Create trigger to calculate duration when ExitTime is updated
DELIMITER //
CREATE TRIGGER calculate_duration 
BEFORE UPDATE ON ParkingRecord
FOR EACH ROW
BEGIN
    IF NEW.ExitTime IS NOT NULL AND OLD.ExitTime IS NULL THEN
        SET NEW.Duration = TIMESTAMPDIFF(HOUR, NEW.EntryTime, NEW.ExitTime);
        IF NEW.Duration < 1 THEN
            SET NEW.Duration = 1; -- Minimum 1 hour charge
        END IF;
    END IF;
END//
DELIMITER ;

-- Create trigger to update slot status when car enters
DELIMITER //
CREATE TRIGGER update_slot_occupied
AFTER INSERT ON ParkingRecord
FOR EACH ROW
BEGIN
    UPDATE ParkingSlot 
    SET SlotStatus = 'Occupied' 
    WHERE SlotNumber = NEW.SlotNumber;
END//
DELIMITER ;

-- Create trigger to update slot status when car exits
DELIMITER //
CREATE TRIGGER update_slot_available
AFTER UPDATE ON ParkingRecord
FOR EACH ROW
BEGIN
    IF NEW.ExitTime IS NOT NULL AND OLD.ExitTime IS NULL THEN
        UPDATE ParkingSlot 
        SET SlotStatus = 'Available' 
        WHERE SlotNumber = NEW.SlotNumber;
    END IF;
END//
DELIMITER ;
