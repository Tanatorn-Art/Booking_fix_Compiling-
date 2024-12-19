import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const {
      Room_ID, // เพิ่ม Room_ID
      Room_Name,
      Capacity,
      Location,
      departserivce,
    } = body;

    // ตรวจสอบข้อมูล
    if (!Room_ID || !Room_Name || !Capacity || !Location || !departserivce) {
      return NextResponse.json(
        { success: false, error: "ข้อมูลไม่ครบถ้วน" },
        { status: 400 }
      );
    }

    // คำสั่ง SQL สำหรับอัพเดทข้อมูล
    const query = `
      UPDATE meetingroom SET
        Room_Name = ?,
        Capacity = ?,
        Location = ?,
        departserivce = ?
      WHERE Room_ID = ?
    `;

    // ส่งข้อมูลไปยังฐานข้อมูล
    const [result]: any = await mysqlPool.query(query, [
      Room_Name,
      Capacity,
      Location,
      departserivce,
      Room_ID // เพิ่ม parameter สำหรับ WHERE clause
    ]);

    // ตรวจสอบว่ามีการอัพเดทข้อมูลจริงหรือไม่
    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "ไม่พบข้อมูลห้องที่ต้องการแก้ไข" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "อัพเดทข้อมูลเรียบร้อยแล้ว",
      data: { id: Room_ID }
    });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการอัพเดทข้อมูล" },
      { status: 500 }
    );
  }
}