const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixLogin() {
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

    // Switch to PSSMS database
    await connection.changeUser({ database: 'PSSMS' });
    console.log('✅ Switched to PSSMS database');

    // Create Users table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Users (
        UserID INT AUTO_INCREMENT PRIMARY KEY,
        Username VARCHAR(50) NOT NULL UNIQUE,
        Password VARCHAR(255) NOT NULL,
        Role ENUM('admin', 'manager') DEFAULT 'manager',
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table ready');

    // Check if admin user exists
    const [existingUsers] = await connection.execute(
      'SELECT * FROM Users WHERE Username = ?',
      ['admin']
    );
    
    if (existingUsers.length === 0) {
      // Create admin user with properly hashed password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.execute(
        'INSERT INTO Users (Username, Password, Role) VALUES (?, ?, ?)',
        ['admin', hashedPassword, 'admin']
      );
      console.log('✅ Created admin user with hashed password');
    } else {
      // Update existing user password if needed
      const user = existingUsers[0];
      const isPasswordCorrect = await bcrypt.compare('admin123', user.Password);
      
      if (!isPasswordCorrect) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await connection.execute(
          'UPDATE Users SET Password = ? WHERE Username = ?',
          [hashedPassword, 'admin']
        );
        console.log('✅ Updated admin user password');
      } else {
        console.log('✅ Admin user password is correct');
      }
    }

    console.log('\n🎉 Login Issue Fixed!');
    console.log('✅ Database is ready for authentication');
    console.log('\n📱 Access Information:');
    console.log('🔐 Login Credentials: admin / admin123');
    console.log('🌐 Frontend URL: http://localhost:3003');
    console.log('🔗 Backend URL: http://localhost:5000');
    console.log('\n🚀 You can now login to SmartPark PSSMS application!');

  } catch (error) {
    console.error('❌ Login fix failed:', error.message);
    console.error('\n💡 If MySQL connection fails:');
    console.error('1. Make sure MySQL server is running: sudo systemctl status mysql');
    console.error('2. Try starting MySQL: sudo service mysql start');
    console.error('3. Check .env file database credentials');
  } finally {
    if (connection) {
      await connection.end();
      console.log('📦 Database connection closed');
    }
  }
}

fixLogin();
