import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";
import bcrypt from "bcryptjs";

// กำหนดประเภทให้กับข้อมูลผู้ใช้
interface User {
  Username: string;
  Password: string;
}

export async function POST(req: Request) {
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  try {
    const { username, password } = await req.json();

    console.log("Request received:", { username, password });

    // Query the database to validate user credentials
    const [rows] = await mysqlPool.query(
      "SELECT Username, Password FROM user WHERE Username = ?",
      [username]
    );

    console.log("Query result:", rows);

    const users = rows as User[];

    if (Array.isArray(users) && users.length > 0) {
      const user = users[0];
      console.log("User found:", user);

      const passwordMatch = await bcrypt.compare(password, user.Password);
      console.log("Password match result:", passwordMatch);

      if (passwordMatch) {
        return NextResponse.json(
          { success: true, message: "Login successful" },
          { headers }
        );
      } else {
        return NextResponse.json(
          { success: false, message: "Invalid username or password" },
          { status: 401, headers }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid username or password" },
        { status: 401, headers }
      );
    }
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500, headers }
    );
  }
}
