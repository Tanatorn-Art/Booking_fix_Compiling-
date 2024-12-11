import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db"; // ตรวจสอบให้แน่ใจว่าเส้นทางถูกต้อง

// Helper function สำหรับการตรวจสอบข้อมูล
const validateInput = (eventName: string, departmentName: string, departmentType: string) => {
  // ตรวจสอบ eventName
  if (!eventName || typeof eventName !== "string" || eventName.trim() === "") {
    return { success: false, error: "ต้องระบุชื่อหัวข้อที่ไม่ว่างเปล่า" };
  }

  if (eventName.length > 255) {
    return { success: false, error: "ชื่อหัวข้อยาวเกินไป (สูงสุด 255 ตัวอักษร)" };
  }

  // ตรวจสอบ departmentName และ departmentType
  if (!departmentName || !departmentType) {
    return { success: false, error: "ข้อมูลไม่ครบถ้วน" };
  }

  return { success: true };
};

export async function POST(request: Request) {
  try {
    // ดึงข้อมูลจาก request body
    const body = await request.json();
    //console.log("Request Body:", body);

    const {
      Start_date,
      End_date,
      Start_time,
      End_time,
      eventName,
      participant,
      agency,
      notes,
      statusName,
      userId,
      carName,
      approvedByAdminId,
      departmentName,
    } = body;

    // ตรวจสอบข้อมูล (คุณสามารถเพิ่ม Validation ได้ตามต้องการ)
    if (!eventName || !departmentName) {
      return NextResponse.json(
        { success: false, error: "ข้อมูลไม่ครบถ้วน" },
        { status: 400 }
      );
    }

    // ตรวจสอบว่ามีการจองซ้ำหรือไม่
    const checkDuplicateQuery = `
      SELECT COUNT(*) as count FROM bookingcars
      WHERE Car_Name = ?
      AND Start_date = ?
      AND End_date = ?
      AND (
        (Start_Time < ? AND End_Time > ?)
        OR (Start_Time < ? AND End_Time > ?)
        OR (Start_Time >= ? AND Start_Time < ?)
        OR (End_Time > ? AND End_Time <= ?)
      )
    `;

    const [checkDuplicateResult]: any = await mysqlPool.query(checkDuplicateQuery, [
      carName,
      Start_date,
      End_date,
      End_time, Start_time,
      Start_time, End_time,
      Start_time, End_time,
      Start_time, End_time
    ]);

    if (checkDuplicateResult[0].count > 0) {
      return NextResponse.json(
        { success: false, error: "มีการจองซ้ำในช่วงเวลานี้" },
        { status: 400 }
      );
    }

    // คำสั่ง SQL สำหรับแทรกข้อมูล
    const query = `
      INSERT INTO bookingcars (
        Start_date,
        End_date,
        Start_Time,
        End_Time,
        Event_Name,
        participant,
        agency,
        Notes,
        Status_Name,
        User_ID,
        Car_Name,
        Approved_By_Admin_ID,
        Department_Name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // ส่งข้อมูลไปยังฐานข้อมูล
    const [result]: any = await mysqlPool.query(query, [
      Start_date,
      End_date,
      Start_time,
      End_time,
      eventName,
      participant,
      agency,
      notes,
      statusName,
      userId,
      carName,
      approvedByAdminId,
      departmentName,
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
