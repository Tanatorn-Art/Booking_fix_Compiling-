import mysql from 'mysql2/promise';

export const mysqlPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bookingroomscars',
  waitForConnections: true,
  connectionLimit: 20,
});
