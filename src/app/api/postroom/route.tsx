import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db"; // ตรวจสอบให้แน่ใจว่าเส้นทางถูกต้อง

export async function POST(request: Request) {
  try {
    // ดึงข้อมูลจาก request body
    const body = await request.json();
    //console.log("Request Body:", body);

    const {
      Room_Name,
      Capacity,
      Location,
      departserivce,
    } = body;

    // ตรวจสอบข้อมูล (คุณสามารถเพิ่ม Validation ได้ตามต้องการ)
    if (!Room_Name || !Capacity || !Location || !departserivce) {
      return NextResponse.json(
        { success: false, error: "ข้อมูลไม่ครบถ้วน" },
        { status: 400 }
      );
    }
    // คำสั่ง SQL สำหรับแทรกข้อมูล
    const query = `
      INSERT INTO meetingroom (
        Room_Name,
        Capacity,
        Location,
        departserivce
      ) VALUES (?, ?, ?, ?)
    `;

    // ส่งข้อมูลไปยังฐานข้อมูล
    const [result]: any = await mysqlPool.query(query, [
      Room_Name,
      Capacity,
      Location,
      departserivce,
    ]);

    //console.log("Database Insert Result:", result);

    // ส่งผลลัพธ์กลับไปยัง Frontend
    return NextResponse.json({
      success: true,
      message: "บันทึกข้อมูลเรียบร้อยแล้ว",
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error("Database Error:", error);

    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" },
      { status: 500 }
    );
  }
}
