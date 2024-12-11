export interface BookingCar {
  Booking_ID: number;
  Start_date: string;
  End_date: string;
  Start_Time: string;
  End_Time: string;
  Car_Name: string;
  Event_Name: string;
  Department_Name: string;
  participant: number;
  Status_Name: string;
}

export async function fetchBookingDataCars(bookingIdcar: string): Promise<BookingCar[]> {
  try {
    const response = await fetch(`/api/bookingcars/${bookingIdcar}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch booking car data');
    }

    if (!Array.isArray(result.bookingCars)) {
      throw new Error('Invalid data format from car API');
    }

    return result.bookingCars; // คืนค่าข้อมูลที่ถูกต้อง
  } catch (error) {
    console.error('Error fetching booking car data:', error);
    return [];
  }
}
