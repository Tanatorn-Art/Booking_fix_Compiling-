import { NextResponse } from 'next/server';
import { mysqlPool } from '@/utils/db';  // Ensure the correct path to db.js
import mysql2 from 'mysql2/promise';  // สำหรับใช้ promise-based API

// Handler for GET requests
export async function GET() {
  try {
    // Query to fetch data from the bookingrooms table
    const [meetingRoomRows] = await mysqlPool.query('SELECT * FROM bookingrooms WHERE Status_Name = ?',['อนุมัติ']);
    //console.log('Booking Data:', meetingRoomRows);  // Log data for debugging

    // Return the data as JSON
    return NextResponse.json({
      success: true,
      meetingRooms: meetingRoomRows,
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
