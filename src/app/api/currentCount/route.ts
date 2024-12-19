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
  const [currentRoomsRows] = await mysqlPool.query(`
    SELECT COUNT(*) AS totalCurrentRooms
    FROM bookingrooms
    WHERE DATE(Start_Date) = CURRENT_DATE()
    AND Status_Name = 'อนุมัติ'
    `);

  // Query สำหรับ cars
  const [currentCarsRows] = await mysqlPool.query(`
    SELECT COUNT(*) AS totalCurrentCars
    FROM bookingcars
    WHERE DATE(Start_Date) = CURRENT_DATE()
    AND Status_Name = 'อนุมัติ'
  `);

  // ... existing code ...

    // ดึงจำนวนการอนุมัติจากทั้ง 2 ตารา
    const totalCurrentRooms = (currentRoomsRows as any[])[0]?.totalCurrentRooms || 0;
    const totalCurrentCars = (currentCarsRows as any[])[0]?.totalCurrentCars || 0;

    // ส่งผลลัพธ์กลับ
    return NextResponse.json({
      success: true,
      totalCurrentRooms: totalCurrentRooms,
      totalCurrentCars: totalCurrentCars,
      grandTotal: totalCurrentRooms + totalCurrentCars
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}