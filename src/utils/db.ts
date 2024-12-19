import mysql from 'mysql2/promise';

export const mysqlPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bookingroomscars',
  waitForConnections: true,
  connectionLimit: 20,
});

interface Session {
  sessionId: string;
  userId: string;
  createdAt: Date;
}

export const db = {
  async insertSession(session: Session) {
    return Promise.resolve();
  }
};