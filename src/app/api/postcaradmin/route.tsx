import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db"; // ตรวจสอบให้แน่ใจว่าเส้นทางถูกต้อง
interface CarData {
  Car_Name: string;
  Capacity: number;
  Location_cars: string;
  Carservice: string;
}
export async function POST(request: Request) {
  try {
    // ดึงข้อมูลจาก request body
    const body = await request.json();
    //console.log("Request Body:", body);
        // ทำความสะอาดและแปลงประเภทข้อมูล
        const carData: CarData = {
          Car_Name: String(body.Car_Name).trim(),
          Capacity: Number(body.Capacity),
          Location_cars: String(body.Location_cars).trim(),
          Carservice: String(body.Carservice).trim(),
        };

        // เพิ่มการตรวจสอบข้อมูลแบบละเอียด
        if (!carData.Car_Name || carData.Car_Name.length > 100) {
          return NextResponse.json(
            { success: false, error: "ชื่อรถไม่ถูกต้องหรือยาวเกินไป" },
            { status: 400 }
          );
        }

        if (isNaN(carData.Capacity) || carData.Capacity <= 0) {
          return NextResponse.json(
            { success: false, error: "จำนวนที่นั่งไม่ถูกต้อง" },
            { status: 400 }
          );
        }
    const {
      Car_Name,
      Capacity,
      Location_cars,
      Carservice,
    } = body;

    // ตรวจสอบข้อมูล (คุณสามารถเพิ่ม Validation ได้ตามต้องการ)
    if (!Car_Name || !Capacity || !Location_cars || !Carservice) {
      return NextResponse.json(
        { success: false, error: "ข้อมูลไม่ครบถ้วน" },
        { status: 400 }
      );
    }
    // คำสั่ง SQL สำหรับแทรกข้อมูล
    const query = `
      INSERT INTO carreserve (
        Car_Name,
        Capacity,
        Location_cars,
        Carservice
      ) VALUES (?, ?, ?, ?)
    `;

    // ส่งข้อมูลไปยังฐานข้อมูล
    const [result]: any = await mysqlPool.query(query, [
      carData.Car_Name,
      carData.Capacity,
      carData.Location_cars,
      carData.Carservice,
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
