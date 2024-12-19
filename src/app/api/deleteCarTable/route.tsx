import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db"; // ตรวจสอบให้แน่ใจว่าเส้นทางถูกต้อง

export async function DELETE(request: Request) {
  try {
    // ดึงข้อมูลจาก request body
    const body = await request.json();
    //console.log("Request Body:", body);

    const { Car_ID } = body;

    // ตรวจสอบว่ามี Booking_ID หรือไม่
    if (!Car_ID) {
      return NextResponse.json(
        { success: false, error: "กรุณาระบุ Booking_ID เพื่อทำการลบข้อมูล" },
        { status: 400 }
      );
    }

    // คำสั่ง SQL สำหรับลบข้อมูล
    const query = `
      DELETE FROM carreserve
      WHERE Car_ID = ?
    `;

    // ส่งคำสั่ง SQL ไปยังฐานข้อมูล
    const [result]: any = await mysqlPool.query(query, [Car_ID]);

    //console.log("Database Delete Result:", result);

    // ตรวจสอบว่าแถวถูกลบหรือไม่
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "ไม่พบข้อมูลที่ต้องการลบ" },
        { status: 404 }
      );
    }

    // ส่งผลลัพธ์กลับไปยัง Frontend
    return NextResponse.json({
      success: true,
      message: "ลบข้อมูลเรียบร้อยแล้ว",
      data: { id: Car_ID },
    });
  } catch (error) {
    console.error("Database Error:", error);

    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการลบข้อมูล" },
      { status: 500 }
    );
  }
}
