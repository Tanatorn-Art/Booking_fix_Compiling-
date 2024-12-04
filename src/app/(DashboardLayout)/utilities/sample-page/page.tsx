// use server component
import { fetchEventDetails } from './fetchEventDetails'; // <== server component
import 'rsuite/Button/styles/index.css';
import dynamic from 'next/dynamic';
const CalendarDate = dynamic(() => import('./CalendarDate'), { ssr: false, loading: () => <p>Loading CalendarDate...</p> });
const Bookingrooms = dynamic(() => import('./Bookingrooms'), { ssr: false, loading: () => <p>Loading Bookingrooms...</p> });

export default async function SamplePage() {
  const eventDetails = await fetchEventDetails();
  // แปลงข้อมูล eventDetails ให้เป็นรูปแบบที่ CalendarDate ใช้
  const eventsForCalendar = eventDetails.map((event: any) => ({
    start: new Date(event.Start_date),
    end: new Date(event.End_date),
    title: event.Event_Name,
    allDay: false,
    roomName: event.Room_Name,
  }));

  return (
    <div>
      {/* calendar */}
      <CalendarDate events={eventsForCalendar} />
      <div style={{marginTop: "65px"}}>

      {/* Booking Details */}
        <Bookingrooms data={eventDetails} />

      </div>
    </div>

  );
}
