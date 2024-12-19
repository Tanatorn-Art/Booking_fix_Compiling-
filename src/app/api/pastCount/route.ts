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
  const [pastRoomsRows] = await mysqlPool.query(`
    SELECT COUNT(*) AS totalPastRooms
    FROM bookingrooms
    WHERE Start_Date < CURRENT_DATE()
    AND MONTH(Start_Date) = MONTH(CURRENT_DATE())
    AND YEAR(Start_Date) = YEAR(CURRENT_DATE());
  `);

  // Query สำหรับ cars
  const [pastCarsRows] = await mysqlPool.query(`
    SELECT COUNT(*) AS totalPastCars
    FROM bookingcars
    WHERE Start_Date < CURRENT_DATE()
    AND MONTH(Start_Date) = MONTH(CURRENT_DATE())
    AND YEAR(Start_Date) = YEAR(CURRENT_DATE());
  `);

  // ... existing code ...

    // ดึงจำนวนการอนุมัติจากทั้ง 2 ตารา
    const totalPastRooms = (pastRoomsRows as any[])[0]?.totalPastRooms || 0;
    const totalPastCars = (pastCarsRows as any[])[0]?.totalPastCars || 0;

    // ส่งผลลัพธ์กลับ
    return NextResponse.json({
      success: true,
      totalPastRooms: totalPastRooms,
      totalPastCars: totalPastCars,
      grandTotal: totalPastRooms + totalPastCars
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}