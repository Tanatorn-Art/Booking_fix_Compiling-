import React from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

const localizer = momentLocalizer(moment)

interface Event {
  start: Date
  end: Date
  title: string
}

interface MyCalendarProps {
  myEventsList: Event[]
}

const MyCalendar: React.FC<MyCalendarProps> = ({ myEventsList }) => (
  <div>
    <Calendar
      localizer={localizer}
      events={myEventsList}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  </div>
)

export default MyCalendar
