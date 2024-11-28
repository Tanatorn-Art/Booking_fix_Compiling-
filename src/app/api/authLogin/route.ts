import { NextResponse } from 'next/server';
import { mysqlPool } from '@/utils/db';  // ตรวจสอบ path ให้ถูกต้อง

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Query database to validate user credentials
    const [rows] = await mysqlPool.query(
      'SELECT Username, Password FROM user WHERE Username = ? AND Password = ?',
      [username, password]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json({ success: true, message: "Login successful" });
    } else {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
