import { NextResponse } from 'next/server';
import { mysqlPool } from '@/utils/db';
import mysql2 from 'mysql2/promise';

// กำหนดประเภทข้อมูลที่ได้รับจากการ query
type ApproveCountResult = {
  totalApproveRooms: number;
  totalApproveCars: number;
};

export async function GET() {
  try {
    // Query เพื่อนับจำนวนการอนุมัติจากตาราง bookingrooms เฉพาะเดือนปัจจุบัน
    const [approveRoomsRows]: [mysql2.RowDataPacket[], mysql2.FieldPacket[]] = await mysqlPool.query(`
      SELECT COUNT(*) AS totalApproveRooms
      FROM bookingrooms
      WHERE Status_Name = 'อนุมัติ'
      AND MONTH(Start_Date) = MONTH(CURRENT_DATE())
      AND YEAR(Start_Date) = YEAR(CURRENT_DATE());
    `);

    // Query เพื่อนับจำนวนการอนุมัติจากตาราง bookingcars เฉพาะเดือนปัจจุบัน
    const [approveCarsRows]: [mysql2.RowDataPacket[], mysql2.FieldPacket[]] = await mysqlPool.query(`
      SELECT COUNT(*) AS totalApproveCars
      FROM bookingcars
      WHERE Status_Name = 'อนุมัติ'
      AND MONTH(Start_Date) = MONTH(CURRENT_DATE())
      AND YEAR(Start_Date) = YEAR(CURRENT_DATE());
    `);

    // ดึงจำนวนการอนุมัติจากทั้ง 2 ตาราง
    const totalApproveRooms = approveRoomsRows[0]?.totalApproveRooms || 0;
    const totalApproveCars = approveCarsRows[0]?.totalApproveCars || 0;

    // ส่งผลลัพธ์กลับ
    return NextResponse.json({
      success: true,
      totalApproveRooms: totalApproveRooms,
      totalApproveCars: totalApproveCars,
      grandTotal: totalApproveRooms + totalApproveCars
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}