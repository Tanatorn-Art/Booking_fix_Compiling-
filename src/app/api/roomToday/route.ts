import { NextResponse } from 'next/server';
import { mysqlPool } from '@/utils/db';  // Ensure the correct path to db.js

// Handler for GET requests - Get today's approved bookings
export async function GET() {
  try {
    // Get today's date in dd-MM-yyyy format
    const currentDate = new Date().toLocaleDateString('en-GB'); // Format: dd/MM/yyyy
    console.log("Formatted current date:", currentDate); // Log for debugging

    // Query to fetch approved bookings for today
    const [meetingRoomRows] = await mysqlPool.query(
      'SELECT * FROM bookingrooms WHERE Status_Name = ? AND DATE_FORMAT(Start_date, "%d-%m-%Y") = ?',
      ['อนุมัติ', currentDate] // กรองเฉพาะการจองที่อนุมัติและวันที่ตรงกับวันนี้
    );
    console.log('Booking Data for today:', meetingRoomRows);  // Log data for debugging

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
