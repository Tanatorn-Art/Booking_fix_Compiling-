import mysql from 'mysql2/promise';

export const mysqlPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'htcbookingroomcar',
  waitForConnections: true,
  connectionLimit: 10,
});
