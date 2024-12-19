import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const {
      Car_ID,
      Car_Name,
      Capacity,
      Location_cars,
      Carservice,
    } = body;

    // ตรวจสอบข้อมูล
    if (!Car_ID || !Car_Name || !Capacity || !Location_cars || !Carservice) {
      return NextResponse.json(
        { success: false, error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    // คำสั่ง SQL สำหรับอัพเดทข้อมูล
    const query = `
      UPDATE carreserve
      SET Car_Name = ?,
          Capacity = ?,
          Location_cars = ?,
          Carservice = ?
      WHERE Car_ID = ?
    `;

    const values = [Car_Name, Capacity, Location_cars, Carservice, Car_ID];

    const [result]: any = await mysqlPool.query(query, values);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: "ไม่พบข้อมูลรถที่ต้องการแก้ไข" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "แก้ไขข้อมูลรถเรียบร้อยแล้ว",
      data: {
        Car_ID,
        Car_Name,
        Capacity,
        Location_cars,
        Carservice
      }
    });

  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการแก้ไขข้อมูล" },
      { status: 500 }
    );
  }
}