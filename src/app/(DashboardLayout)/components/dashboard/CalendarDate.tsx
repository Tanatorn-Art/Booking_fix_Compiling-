import { useState, useEffect, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { Modal, Button, Table,Steps  } from "rsuite";
//import Bookingrooms from '@/app/(DashboardLayout)/components/dashboard/bookingrooms';
import PencilSquareIcon from '@rsuite/icons/legacy/PencilSquare';
import BookIcon from '@rsuite/icons/legacy/Book';
import WechatIcon from '@rsuite/icons/Wechat';
import SteamSquareIcon from '@rsuite/icons/legacy/SteamSquare';
import { Gear, AddOutline } from '@rsuite/icons';
import { HStack } from 'rsuite';
import PieChartIcon from '@rsuite/icons/PieChart';

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

interface EventData {
  Start_date: string;
  End_date: string;
  Event_Name: string;
  Room_Name: string;
}

interface CalendarEvent {
  start: Date;
  end: Date;
  title: string;
  allDay: boolean;
  roomName: string;
}
const ChartIcon = ({ color }) => (
  <PieChartIcon style={{ color, marginRight: 2, marginLeft: 10, fontSize: '16px' }} />
);

export default function CalendarDate() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventsOnSelectedDate, setEventsOnSelectedDate] = useState<CalendarEvent[]>([]);

  // Fetch events from API when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/bookingrooms');
        const data = await response.json();

        const eventList = data.meetingRooms.map((item: EventData) => {
          const start = new Date(item.Start_date);
          const end = new Date(item.End_date);

          return {
            start: start,
            end: end,
            title: item.Event_Name,
            allDay: false,
            roomName: item.Room_Name,
          };
        });

        setEvents(eventList); // Set events after fetching
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []); // Only run this effect on initial render

  const eventPropGetter = (event: CalendarEvent, start: Date, end: Date, isSelected: boolean) => {
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
        padding: "2px", // ลด padding เพื่อให้ดูเล็กลง
        fontSize: "14px", // ลดขนาดตัวอักษร
        lineHeight: "1.2", // ลดระยะห่างระหว่างบรรทัด
        textAlign: "Left", // จัดกึ่งกลางข้อความ
      },
    };
  };
  // Handle event click to filter events by selected date
  const handleEventClick = (event: CalendarEvent) => {
    const selectedDate = event.start;

    // Filter events based on the selected date
    const filteredEvents = events.filter((e) => {
      return (
        selectedDate.getDate() === e.start.getDate() &&
        selectedDate.getMonth() === e.start.getMonth() &&
        selectedDate.getFullYear() === e.start.getFullYear()
      );
    });

    setEventsOnSelectedDate(filteredEvents); // Set filtered events
    setModalIsOpen(true); // Open the modal
  };

  // Close modal and clear the events for the selected date
  const closeModal = () => {
    setModalIsOpen(false);
    setEventsOnSelectedDate([]); // Clear selected date events
  };

  // Memoize eventsOnSelectedDate to avoid unnecessary re-renders
  const memoizedEventsOnSelectedDate = useMemo(() => eventsOnSelectedDate, [eventsOnSelectedDate]);


  return (
    <div style={{ height: "60vh", margin: "20px" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        selectable={true}
        toolbar={false}
        eventPropGetter={eventPropGetter} // Event handler on event click
      />
          {/* <div style={{marginLeft: "760px", marginTop: "10px"}}>
            <HStack spacing={10}>
              <ChartIcon color="#3498FF" /> <span style={{ color: '#3498FF' }}>ผ่านมาแล้ว</span>
              <ChartIcon color="green" /> <span style={{ color: 'green' }}>วันนี้</span>
              <ChartIcon color="#f5a623" /> <span style={{ color: '#f5a623' }}>ล่วงหน้า</span>
            </HStack>
          </div> */}

      {/* Modal for event details */}
      {/* <Modal open={modalIsOpen} onClose={closeModal}>
        <Modal.Header style={{ backgroundColor: '#f7f7f7', padding: '15px 20px', borderBottom: '1px solid #ddd' }}>
          <Modal.Title style={{ fontWeight: 'bold', fontSize: '18px', color: '#333' }}>
            Events on {memoizedEventsOnSelectedDate.length > 0 && memoizedEventsOnSelectedDate[0].start.toLocaleDateString()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '20px', backgroundColor: '#fff' }}>
          {memoizedEventsOnSelectedDate.length > 0 ? (
            <Table height={300} data={memoizedEventsOnSelectedDate} autoHeight>
              <Table.Column width={200} align="center" fixed>
                <Table.HeaderCell style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold', color: '#555' }}>
                  Event Name
                </Table.HeaderCell>
                <Table.Cell dataKey="title" />
              </Table.Column>
              <Table.Column width={150}>
                <Table.HeaderCell style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold', color: '#555' }}>
                  Room
                </Table.HeaderCell>
                <Table.Cell dataKey="roomName" />
              </Table.Column>
            </Table>
          ) : (
            <p style={{ color: '#777', textAlign: 'center' }}>No events on this day</p>
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#f7f7f7', borderTop: '1px solid #ddd', padding: '10px 20px' }}>
          <Button onClick={closeModal} appearance="subtle" style={{ fontSize: '14px', color: '#007bff', borderColor: '#007bff' }}>
            Close
          </Button>
        </Modal.Footer>
       </Modal> */}

    </div>
  );
}
