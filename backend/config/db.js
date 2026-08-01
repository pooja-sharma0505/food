const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();
console.log("========== ENV DEBUG ==========");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", JSON.stringify(process.env.DB_PASSWORD));
console.log("Password Length:", process.env.DB_PASSWORD?.length);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_SSL_CA:", process.env.DB_SSL_CA);
console.log("Current Working Directory:", process.cwd());
console.log("===============================");
// Validate required environment variables
const requiredEnvVars = [
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME'
];

const missingEnvVars = requiredEnvVars.filter(
  key => !process.env[key]
);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing environment variables:');
  console.error(missingEnvVars.join(', '));
  process.exit(1);
}

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

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

// TiDB Cloud requires TLS.
// Use rejectUnauthorized: false for TiDB Cloud connections.
dbConfig.ssl = {
  rejectUnauthorized: false
};

console.log('\n========== DATABASE CONFIG ==========');
console.log('Host     :', dbConfig.host);
console.log('Port     :', dbConfig.port);
console.log('Database :', dbConfig.database);
console.log('User     :', dbConfig.user);
console.log('SSL      : Enabled');
console.log('=====================================\n');

const pool = mysql.createPool(dbConfig);

pool.getConnection((err, connection) => {
  if (err) {
    console.error('\n❌ Database Connection Failed');
    console.error('--------------------------------');
    console.error('Error Code    :', err.code);
    console.error('Error Number  :', err.errno);
    console.error('SQL State     :', err.sqlState);
    console.error('Message       :', err.message);
    console.error('--------------------------------\n');

    switch (err.code) {
      case 'ER_ACCESS_DENIED_ERROR':
        console.log('👉 Wrong username or password.');
        break;

      case 'ER_BAD_DB_ERROR':
        console.log('👉 Database does not exist.');
        break;

      case 'ECONNREFUSED':
        console.log('👉 Server refused the connection.');
        break;

      case 'ETIMEDOUT':
        console.log('👉 Connection timeout.');
        break;

      case 'ENOTFOUND':
        console.log('👉 Hostname not found.');
        break;

      default:
        console.log('👉 Unknown database error.');
    }

    return;
  }

  console.log('✅ Database Connected Successfully');
  console.log('Server :', dbConfig.host + ':' + dbConfig.port);
  console.log('Database :', dbConfig.database);

  connection.release();
});

module.exports = pool.promise();