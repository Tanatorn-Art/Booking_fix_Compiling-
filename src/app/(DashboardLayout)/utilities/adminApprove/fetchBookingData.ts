export interface BookingRoom {
  Booking_ID: number;
  Start_date: string;
  End_date: string;
  Start_Time: string;
  End_Time: string;
  Room_Name: string;
  Event_Name: string;
  Department_Name: string;
  participant: number;
  Status_Name: string;
}

export async function fetchBookingData(bookingId: string): Promise<BookingRoom[]> {
  try {
    const response = await fetch(`/api/bookingrooms/${bookingId}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch booking data');
    }

    if (!Array.isArray(result.meetingRooms)) {
      throw new Error('Invalid data format from API');
    }

    return result.meetingRooms;
  } catch (error) {
    console.error('Error fetching booking data:', error);
    return [];
  }
}
