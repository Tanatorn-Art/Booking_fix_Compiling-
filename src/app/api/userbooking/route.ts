import { NextResponse, NextRequest } from 'next/server';
import { mysqlPool } from '@/utils/db';  // ตรวจสอบเส้นทางที่ถูกต้องไปยัง db.js
import mysql2 from 'mysql2/promise';  // ใช้ promise-based API สำหรับการเชื่อมต่อ MySQL

// Handler สำหรับคำร้องขอ GET
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('User_ID');

  if (!userId) {
    return NextResponse.json({ success: false, error: 'User_ID is required' }, { status: 400 });
  }

  try {
    // ดึงข้อมูลจากตาราง bookingrooms โดยใช้ User_ID
    const [meetingRoomRows] = await mysqlPool.query('SELECT * FROM bookingrooms WHERE User_ID = ?', [userId]);
    console.log('Booking Data:', meetingRoomRows);  // Log ข้อมูลสำหรับการดีบัก

    // คืนค่าข้อมูลเป็น JSON
    return NextResponse.json({
      success: true,
      meetingRooms: meetingRoomRows,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
