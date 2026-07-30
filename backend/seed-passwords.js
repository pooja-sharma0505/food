const bcrypt = require('bcrypt');
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  socketPath: process.env.DB_SOCKET,
});

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
