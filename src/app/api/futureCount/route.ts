import { NextResponse } from 'next/server';
import { mysqlPool } from '@/utils/db';
import mysql2 from 'mysql2/promise';

// กำหนดประเภทข้อมูลที่ได้รับจากการ query
type PastCountResult = {
  totalPastRooms: number;
  totalPastCars: number;
};

export async function GET() {
  try {
// ... existing code ...

  // Query สำหรับ rooms
  const [futureRoomsRows] = await mysqlPool.query(`
    SELECT COUNT(*) AS totalFutureRooms
    FROM bookingrooms
    WHERE DATE(Start_Date) > CURRENT_DATE()
    AND Status_Name = 'อนุมัติ'
  `);

  // Query สำหรับ cars
  const [futureCarsRows] = await mysqlPool.query(`
    SELECT COUNT(*) AS totalFutureCars
    FROM bookingcars
    WHERE DATE(Start_Date) > CURRENT_DATE()
    AND Status_Name = 'อนุมัติ'
  `);


  // ... existing code ...

    // ดึงจำนวนการอนุมัติจากทั้ง 2 ตารา
    const totalFutureRooms = (futureRoomsRows as any[])[0]?.totalFutureRooms || 0;
    const totalFutureCars = (futureCarsRows as any[])[0]?.totalFutureCars || 0;

    // ส่งผลลัพธ์กลับ
    return NextResponse.json({
      success: true,
      totalFutureRooms: totalFutureRooms,
      totalFutureCars: totalFutureCars,
      grandTotal: totalFutureRooms + totalFutureCars
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}