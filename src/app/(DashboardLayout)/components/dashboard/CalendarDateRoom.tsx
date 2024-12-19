import { useState, useEffect, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { Card, CardContent, Typography,IconButton, Box  } from "@mui/material";
import PieChartIcon from '@rsuite/icons/PieChart';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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

const ChartIcon = ({ color }: { color: string }) => (
  <PieChartIcon style={{ color, marginRight: 2, marginLeft: 10, fontSize: '16px' }} />
);

export default function CalendarDateNosts() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [eventsOnSelectedDate, setEventsOnSelectedDate] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigateToNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const navigateToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

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
        textAlign: "left" as const, // เพิ่ม as const เพื่อระบุ type ที่แน่นอน
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
    <Card sx={{
      marginBottom: "20px",
      marginLeft: 0, // เพิ่มเพื่อให้ชิดซ้าย
      width: '100%', // ให้ card กินพื้นที่เต็มความกว้าง
      backgroundColor: '#F8F8FF',
    }}>
      <CardContent sx={{
        padding: 0,
        '&:last-child': {
          paddingBottom: 0
        }
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px'
        }}>
          <Typography variant="h5">Calendar Date Room</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={navigateToPreviousMonth}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography sx={{ mx: 2 }}>
              {format(currentDate, 'MMMM yyyy')}
            </Typography>
            <IconButton onClick={navigateToNextMonth}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>
        <div style={{
          height: "50vh",
          marginTop: "0px",
          width: '100%'
        }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{
              height: "100%",
              width: '100%'
            }}
            selectable={true}
            toolbar={false}
            eventPropGetter={eventPropGetter}
            date={currentDate}
            onNavigate={date => setCurrentDate(date)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
