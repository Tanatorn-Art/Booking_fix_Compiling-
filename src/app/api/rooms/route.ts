import { NextResponse } from 'next/server';
import { mysqlPool } from '@/utils/db';

export async function GET() {
  try {
    // ปรับ query เพื่อให้ได้ข้อมูลที่จำเป็นสำหรับ EventMap
    const [rooms] = await mysqlPool.query(`
      SELECT
        Room_ID as id,
        Room_Name as name,
        Capacity as capacity,
        Location as floor,
        CASE
          WHEN EXISTS (
            SELECT 1 FROM bookings
            WHERE room_id = Room_ID
            AND end_time >= NOW()
          ) THEN false
          ELSE true
        END as isAvailable
      FROM meetingroom
    `);

    return NextResponse.json({
      success: true,
      rooms: rooms,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}