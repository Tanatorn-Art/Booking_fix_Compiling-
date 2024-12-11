// use server component
import { fetchEventDetails } from './fetchEventDetails'; // <== server component
import 'rsuite/Button/styles/index.css';
import dynamic from 'next/dynamic';
import { Typography } from '@mui/material';
const CalendarDate = dynamic(() => import('./CalendarDate'), { ssr: false, loading: () => <p>Loading CalendarDate...</p> });

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

      </div>
      <div>
         {/* ส่วนท้าย */}
         <a href="/authentication/login/" style={{ textDecoration: 'none' }}>
        <Typography
          variant="body1"
          sx={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '1.2rem',
            color: '#1976d2',
            cursor: 'pointer', // เพิ่ม cursor pointer
          }}
        >
         - Reserve your meeting room -
        </Typography>
      </a>
      </div>
    </div>

  );
}
