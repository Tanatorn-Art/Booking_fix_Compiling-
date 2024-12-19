import { NextResponse } from 'next/server';
import { mysqlPool } from '@/utils/db';
import mysql2 from 'mysql2/promise';

// กำหนดประเภทข้อมูลที่ได้รับจากการ query
type CarCountResult = {
  totalCars: number;
  usedCars: number;
};

export async function GET() {
  try {
    // Query เพื่อดึงจำนวนห้องประชุมทั้งหมด
    const [totalCarsRows]: [mysql2.RowDataPacket[], mysql2.FieldPacket[]] = await mysqlPool.query(`
      SELECT COUNT(*) AS totalCars FROM carreserve;
    `);

    // Query เพื่อดึงจำนวนห้องที่ใช้งานอยู่ในปัจจุบัน
    const [usedCarsRows]: [mysql2.RowDataPacket[], mysql2.FieldPacket[]] = await mysqlPool.query(`
      SELECT COUNT(*) AS usedCars
      FROM bookingcars
      WHERE Start_date <= CURDATE() AND End_date >= CURDATE() AND Status_Name = 'อนุมัติ';
    `);

    // ดึงจำนวนห้องทั้งหมดและจำนวนห้องที่ใช้งาน
    const totalCars = totalCarsRows[0]?.totalCars || 0;
    const usedCars = usedCarsRows[0]?.usedCars || 0;

    // ส่งผลลัพธ์กลับ
    return NextResponse.json({
      success: true,
      totalCars,
      usedCars,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
