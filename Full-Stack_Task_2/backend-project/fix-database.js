const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixDatabase() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'PSSMS',
        port: process.env.DB_PORT || 3306,
        multipleStatements: true,
      });

    console.log('Connected to MySQL server successfully');

    // Switch to PSSMS database
    await connection.changeUser({ database: 'PSSMS' });
    console.log('Switched to PSSMS database');

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
      console.log('✅ Admin user already exists');
    }

    console.log('\n✅ Database is ready for login!');
    console.log('🔐 Login Credentials: admin / admin123');
    console.log('🌐 Frontend URL: http://localhost:3003');
    console.log('🔗 Backend URL: http://localhost:5000');
    console.log('\n🚀 You can now login to the SmartPark PSSMS application!');

  } catch (error) {
    console.error('❌ Database fix failed:', error.message);
    console.error('\n💡 If MySQL is not running, try:');
    console.error('sudo systemctl start mysql');
    console.error('\n💡 If connection fails, check:');
    console.error('1. MySQL server is running');
    console.error('2. Database credentials in .env file');
    console.error('3. MySQL socket path');
  } finally {
    if (connection) {
      await connection.end();
      console.log('📦 Database connection closed');
    }
  }
}

fixDatabase();
