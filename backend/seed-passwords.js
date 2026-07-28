const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'food_db',
};

// Only use a local socket when explicitly configured (e.g. local XAMPP).
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
const promisePool = pool.promise();

async function updatePasswords() {
  const hashedPassword = await bcrypt.hash('password', 10);
  console.log('Hashed password:', hashedPassword);

  const [result] = await promisePool.query(
    'UPDATE users SET password = ? WHERE password = ?',
    [hashedPassword, 'TEMP_PASSWORD']
  );

  console.log('Updated', result.affectedRows, 'users');

  const [rows] = await promisePool.query('SELECT id, name, email, LEFT(password, 20) AS pwd FROM users');
  rows.forEach(r => console.log(r.id, r.name, r.email, r.pwd));

  process.exit(0);
}

updatePasswords().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
