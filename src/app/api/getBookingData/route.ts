import { NextResponse } from 'next/server';
import { mysqlPool } from '@/utils/db';  // ตรวจสอบเส้นทางการเชื่อมต่อฐานข้อมูล

export async function GET(request: Request) {
  const url = new URL(request.url);
  const bookingId = url.searchParams.get('Booking_ID');

  if (!bookingId) {
    return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
  }

  try {
    // ทำการ query โดยใช้ Booking_ID
    const [rows] = await mysqlPool.query('SELECT * FROM bookingrooms WHERE Booking_ID = ?', [bookingId]);

    // ตรวจสอบว่า rows เป็น array หรือไม่
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // บอก TypeScript ว่า rows[0] คือข้อมูลของการจอง
    const bookingData = rows[0];  // `rows[0]` จะมีข้อมูลตามที่เราคาดหวัง

    return NextResponse.json(bookingData);  // ส่งข้อมูลการจองแถวแรก
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
