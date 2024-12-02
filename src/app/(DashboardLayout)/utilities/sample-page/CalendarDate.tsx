  "use client";
  import { useState, useMemo } from "react";
  import { Calendar, dateFnsLocalizer } from "react-big-calendar";
  import "react-big-calendar/lib/css/react-big-calendar.css";
  import { format, parse, startOfWeek, getDay } from "date-fns";
  import enUS from "date-fns/locale/en-US";
  import moment from "moment";
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

    const eventPropGetter:any = (event: CalendarEvent, start: Date, end: Date, isSelected: boolean) => {
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
    const staticDateTime = moment().format('ll');
    return (

      <div style={{ height: "60vh", margin: "20px" }}>
      <p style={{
        marginBottom: "15px",
        color: "#404040",
        fontSize: "25px"}}>
          Meeting Rooms : {staticDateTime}
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
      </div>
    );
  }
