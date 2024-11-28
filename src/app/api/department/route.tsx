import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db"; // ตรวจสอบให้แน่ใจว่าเส้นทางถูกต้อง

// Handler สำหรับ GET Request
export async function GET() {
  try {
    const [departmentRows] = await mysqlPool.query(
      "SELECT Department_Name FROM department"
    );
    return NextResponse.json({
      success: true,
      departments: departmentRows,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Handler สำหรับ POST Request
export async function POST(request: Request) {
  try {
    const { departmentName, departmentType } = await request.json();

    // ตรวจสอบข้อมูลที่ส่งมา
    if (!departmentName || !departmentType) {
      return NextResponse.json(
        { success: false, error: "ข้อมูลไม่ครบถ้วน" },
        { status: 400 }
      );
    }

    // รวมชื่อหน่วยงานและประเภท
    const fullDepartmentName = `${departmentName} (${departmentType})`;

    // คำสั่ง SQL สำหรับเพิ่มข้อมูล
    const query = "INSERT INTO bookingrooms (Department_Name) VALUES (?)";

    // บันทึกข้อมูลลงในฐานข้อมูล
    const [result]: any = await mysqlPool.query(query, [fullDepartmentName]);

    return NextResponse.json({
      success: true,
      message: "บันทึกข้อมูลเรียบร้อยแล้ว",
      data: { id: result.insertId },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
