import { NextResponse } from 'next/server';
import { mysqlPool } from '@/utils/db';  // Ensure the correct path to db.js

export async function GET() {
  try {
    const [reserveCarsRows] = await mysqlPool.query(
      `SELECT Car_Name FROM carreserve`
    );
    console.log('Cars Data:', reserveCarsRows);  // Log data for debugging

    return NextResponse.json({
      success: true,
      carreserves: reserveCarsRows,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}