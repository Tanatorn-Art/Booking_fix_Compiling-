"use client";
import { useState, useMemo, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import moment from "moment";
import dynamic from 'next/dynamic';
const PieChartIcon = dynamic(() => import('@rsuite/icons/PieChart'), { ssr: false });

// Localizer setup for react-big-calendar
const locales = {
  "en-US": enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
interface CalendarEvent {
  start: Date;
  end: Date;
  title: string;
  allDay: boolean;
  roomName: string;
}
export default function CalendarDate({ events }: { events: CalendarEvent[] }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventsOnSelectedDate, setEventsOnSelectedDate] = useState<CalendarEvent[]>([]);
  const eventPropGetter: any = (event: CalendarEvent, start: Date, end: Date, isSelected: boolean) => {
    const today = new Date();
    let backgroundColor = "";
    if (start.toDateString() === today.toDateString()) {
      backgroundColor = "#4ac76e"; // Today
    } else if (start < today) {
      backgroundColor = "#8aa1e3"; // Past
    } else if (start > today) {
      backgroundColor = "#fbb16e"; // Future
    }
    return {
      style: {
        backgroundColor,
        color: "white",
        border: "none",
        borderRadius: "4px",
        padding: "2px",
        fontSize: "14px",
        lineHeight: "1.2",
        textAlign: "Left",
      },
    };
  };
  const closeModal = () => {
    setModalIsOpen(false);
    setEventsOnSelectedDate([]);
  };
  const memoizedEventsOnSelectedDate = useMemo(() => eventsOnSelectedDate, [eventsOnSelectedDate]);
  const staticDateTime = moment().format("ll");
  const [currentDate, setCurrentDate] = useState<string>('');
  // Function to update current date
  const updateCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0'); // เติมศูนย์หน้าหากวันเป็นตัวเลข 1 หลัก
    const month = date.toLocaleString('default', { month: 'short' }).toLowerCase(); // เดือนแบบย่อ (เช่น 'nov')
    const year = date.getFullYear();
    setCurrentDate(`${day} ${month} ${year}`);
  };
  // Use useEffect to update the current date when the component mounts
  useEffect(() => {
    updateCurrentDate();
  }, []); // Empty dependency array means this runs once when the component is mounted

  return (
    <div style={{ height: "60vh", margin: "20px" }}>
      <p
        style={{
          marginBottom: "15px",
          color: "#404040",
          fontSize: "25px",
        }}
      >
        Meeting Rooms : {currentDate}
      </p>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        selectable={true}
        toolbar={false}
        eventPropGetter={eventPropGetter}
      />
    <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'flex-end', // เพิ่มเพื่อให้ชิดขวา
            marginTop: '16px', // เพิ่มระยะห่างด้านบน
            marginRight: '16px' // เพิ่มระยะห่างด้านขวา
          }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PieChartIcon style={{ color: '#8aa1e3', fontSize: '16px' }} />
          <span style={{ marginLeft: '4px', color: '#8aa1e3' }}>ผ่านมาแล้ว</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PieChartIcon style={{ color: 'green', fontSize: '16px' }} />
          <span style={{ marginLeft: '4px', color: 'green' }}>ปัจจุบัน</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <PieChartIcon style={{ color: '#f5a623', fontSize: '16px' }} />
          <span style={{ marginLeft: '4px', color: '#f5a623' }}>ล่วงหน้า</span>
        </div>

      </div>
    </div>
  );
}
