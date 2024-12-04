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

export async function PUT(request: Request) {
  try {
    // ดึงข้อมูลจาก request body
    const body = await request.json();
    console.log("Request Body:", body);

    const {
      Booking_ID, // Booking ID ที่ใช้ในการค้นหาข้อมูลที่จะอัปเดต
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

    // ตรวจสอบข้อมูลที่สำคัญ
    if (!Booking_ID || !eventName || !departmentName) {
      return NextResponse.json(
        { success: false, error: "ข้อมูลไม่ครบถ้วน" },
        { status: 400 }
      );
    }

    // ตรวจสอบว่ามีการจองซ้ำหรือไม่
    const checkDuplicateQuery = `
      SELECT COUNT(*) as count FROM bookingrooms
      WHERE Room_Name = ?
      AND Start_date = ?
      AND End_date = ?
      AND Booking_ID != ? -- ต้องเป็น Booking_ID ที่ไม่เหมือนกัน
      AND (
        (Start_Time < ? AND End_Time > ?)
        OR (Start_Time < ? AND End_Time > ?)
        OR (Start_Time >= ? AND Start_Time < ?)
        OR (End_Time > ? AND End_Time <= ?)
      )
    `;

    const [checkDuplicateResult]: any = await mysqlPool.query(checkDuplicateQuery, [
      roomName,
      Start_date,
      End_date,
      Booking_ID, // ใช้ Booking_ID เพื่อตรวจสอบการจองซ้ำในฐานข้อมูล
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

    // คำสั่ง SQL สำหรับอัปเดตข้อมูล
    const query = `
      UPDATE bookingrooms
      SET
        Start_date = ?,
        End_date = ?,
        Start_Time = ?,
        End_Time = ?,
        Event_Name = ?,
        participant = ?,
        equipmentUse = ?,
        agency = ?,
        Notes = ?,
        Status_Name = ?,
        User_ID = ?,
        Room_Name = ?,
        Approved_By_Admin_ID = ?,
        Department_Name = ?
      WHERE Booking_ID = ?
    `;

    // ส่งข้อมูลไปยังฐานข้อมูลเพื่ออัปเดต
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
      Booking_ID, // ใช้ Booking_ID เพื่ออัปเดตข้อมูล
    ]);

    console.log("Database Update Result:", result);

    // ตรวจสอบว่าอัปเดตสำเร็จหรือไม่
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "ไม่พบข้อมูลที่ต้องการอัปเดต" },
        { status: 404 }
      );
    }

    // ส่งผลลัพธ์กลับไปยัง Frontend
    return NextResponse.json({
      success: true,
      message: "อัปเดตข้อมูลเรียบร้อยแล้ว",
      data: { id: Booking_ID },
    });
  } catch (error) {
    console.error("Database Error:", error);

    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" },
      { status: 500 }
    );
  }
}
