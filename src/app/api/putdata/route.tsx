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
    console.log("Request Body:", body);

    const {
      Start_date,
      End_date,
      Start_time,
      End_time,
      eventName,
      participant,
      equipmentUse,
      agency,
      notes,
      statusName,
      userId,
      roomName,
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

    // คำสั่ง SQL สำหรับแทรกข้อมูล
    const query = `
      INSERT INTO bookingrooms (
        Start_date,
        End_date,
        Start_Time,
        End_Time,
        Event_Name,
        participant,
        equipmentUse,
        agency,
        Notes,
        Status_Name,
        User_ID,
        Room_Name,
        Approved_By_Admin_ID,
        Department_Name
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // ส่งข้อมูลไปยังฐานข้อมูล
    const [result]: any = await mysqlPool.query(query, [
      Start_date,
      End_date,
      Start_time,
      End_time,
      eventName,
      participant,
      equipmentUse,
      agency,
      notes,
      statusName,
      userId,
      roomName,
      approvedByAdminId,
      departmentName,
    ]);

    console.log("Database Insert Result:", result);

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
