interface Session {
  sessionId: string;
  userId: string;
  createdAt: Date;
}

const db = {
  async insertSession(session: Session) {
    // ใส่ logic การบันทึก session ลงฐานข้อมูล
    return Promise.resolve();
  }
};

export default db;