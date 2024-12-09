import { NextResponse } from 'next/server';
import { mysqlPool } from '@/utils/db';  // Ensure the correct path to db.js

// Handler for GET requests
export async function GET() {
  try {
    // Query to fetch data from the meetingroom table
    const [meetingRoomRows] = await mysqlPool.query(
      'SELECT Room_Name, Capacity, Location FROM meetingroom');
    //console.log('Meeting Room Data:', meetingRoomRows);  // Log data for debugging

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
