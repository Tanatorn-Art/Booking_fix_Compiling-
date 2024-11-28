import { NextResponse } from 'next/server';
import { mysqlPool } from '@/utils/db';

export async function POST(request: Request) {
  try {
    const { eventName } = await request.json(); // รับข้อมูล JSON

    // ตรวจสอบข้อมูลที่ส่งมา
    if (!eventName || typeof eventName !== 'string' || eventName.trim() === '') {
      return NextResponse.json({ success: false, error: 'ต้องระบุชื่อหัวข้อที่ไม่ว่างเปล่า' }, { status: 400 });
    }

    if (eventName.length > 255) {
      return NextResponse.json({ success: false, error: 'ชื่อหัวข้อยาวเกินไป (สูงสุด 255 ตัวอักษร)' }, { status: 400 });
    }
    // คำสั่ง SQL
    const query = 'INSERT INTO bookingrooms (Event_Name) VALUES (?)';

    // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
    const [result]: any = await mysqlPool.query(query, [eventName]);

    // ส่งผลลัพธ์กลับไปยัง Frontend
    return NextResponse.json({
      success: true,
      message: 'บันทึกข้อมูลเรียบร้อยแล้ว',
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' },
      { status: 500 }
    );
  }
}
