import { NextResponse } from 'next/server';
import { mysqlPool } from '@/utils/db';
import mysql2 from 'mysql2/promise';

// กำหนดประเภทข้อมูลที่ได้รับจากการ query
type MeetingRoomCountResult = {
  totalRooms: number;
  usedRooms: number;
};

export async function GET() {
  try {
    // Query เพื่อดึงจำนวนห้องประชุมทั้งหมด
    const [totalRoomsRows]: [mysql2.RowDataPacket[], mysql2.FieldPacket[]] = await mysqlPool.query(`
      SELECT COUNT(*) AS totalRooms FROM meetingroom;
    `);

    // Query เพื่อดึงจำนวนห้องที่ใช้งานอยู่ในปัจจุบัน
    const [usedRoomsRows]: [mysql2.RowDataPacket[], mysql2.FieldPacket[]] = await mysqlPool.query(`
      SELECT COUNT(*) AS usedRooms
      FROM bookingrooms
      WHERE Start_date <= CURDATE() AND End_date >= CURDATE() AND Status_Name = 'อนุมัติ';
    `);

    // ดึงจำนวนห้องทั้งหมดและจำนวนห้องที่ใช้งาน
    const totalRooms = totalRoomsRows[0]?.totalRooms || 0;
    const usedRooms = usedRoomsRows[0]?.usedRooms || 0;

    // ส่งผลลัพธ์กลับ
    return NextResponse.json({
      success: true,
      totalRooms,
      usedRooms,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
