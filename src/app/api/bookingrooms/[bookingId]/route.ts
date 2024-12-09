import { NextResponse, NextRequest } from 'next/server';
import { mysqlPool } from '@/utils/db'; // Ensure the correct path to db.js

interface Params {
  params: {
    bookingId: string;
  };
}

interface RequestBody {
  Status_Name: string;
}

// Handler for GET requests
export async function GET() {
  try {
    // Query to fetch data from the bookingrooms table where Status_Name is either 'pending' or 'Edit'
    const [meetingRoomRows] = await mysqlPool.query('SELECT * FROM bookingrooms WHERE Status_Name IN (?, ?)', ['pending', 'Edit']);
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


// Handler for PUT requests (to update booking status)
export async function PUT(req: NextRequest, { params }: Params) {
  const { bookingId } = params;

  if (!bookingId) {
    return NextResponse.json({ success: false, error: 'Missing bookingId in URL parameters' }, { status: 400 });
  }

  let requestBody: RequestBody;
  try {
    requestBody = await req.json() as RequestBody;
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }

  const { Status_Name } = requestBody;

  if (!Status_Name) {
    return NextResponse.json({ success: false, error: 'Missing Status_Name' }, { status: 400 });
  }

  try {
    const [result] = await mysqlPool.execute(
      'UPDATE bookingrooms SET Status_Name = ? WHERE Booking_ID = ?',
      [Status_Name, bookingId]
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
