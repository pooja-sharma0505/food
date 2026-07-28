const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'food_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Only use a local socket when explicitly configured (e.g. local XAMPP).
// mysql2 ignores host/port whenever socketPath is set, so it must never
// be set by default or remote hosts like TiDB will silently fail.
if (process.env.DB_SOCKET) {
  dbConfig.socketPath = process.env.DB_SOCKET;
}

// TiDB Cloud (and most managed MySQL-compatible hosts) require TLS.
if (process.env.DB_SSL_CA) {
  dbConfig.ssl = {
    ca: fs.readFileSync(process.env.DB_SSL_CA),
    minVersion: 'TLSv1.2',
  };
}

const pool = mysql.createPool(dbConfig);

// Test the connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL database:', process.env.DB_NAME || 'food_db');
  connection.release();
});

module.exports = pool.promise();
