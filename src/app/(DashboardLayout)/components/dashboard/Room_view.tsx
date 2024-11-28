import React, { useState, useEffect } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { Link } from 'react-router-dom';

interface BookingRoom {
  Start_date: string;
  End_date: string;
  Start_Time: string;
  End_Time: string;
  Room_Name: string;
  Event_Name: string;
  Department_Name: string;
}

const Bookingrooms = () => {
  const [data, setData] = useState<BookingRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentMeeting, setCurrentMeeting] = useState<BookingRoom | null>(null);

  // ดึงข้อมูลการจองห้องประชุม
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/bookingrooms/');
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        setData(result.meetingRooms);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const formatDateWithShortMonth = (isoDate: string) => {
      const date = new Date(isoDate);
      const day = String(date.getDate()).padStart(2, '0');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      return `${day} / ${month} / ${year}`;
    };

    const intervalId = setInterval(() => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setCurrentTime(time);

      const date = formatDateWithShortMonth(now.toISOString());
      setCurrentDate(date);

      // หา meeting ที่กำลังเกิดขึ้น
      const ongoingMeeting = data.find((booking) => {
        const startTime = booking.Start_Time;
        const endTime = booking.End_Time;
        return currentTime >= startTime && currentTime <= endTime;
      });
      setCurrentMeeting(ongoingMeeting || null);

    }, 1000);

    return () => clearInterval(intervalId);
  }, [data, currentTime]);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatTime = (time: string) => time.slice(0, 5);

  const filterCurrentDateBookings = (bookings: BookingRoom[]) => {
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate.toISOString());
    return bookings.filter((booking) => formatDate(booking.Start_date) === formattedDate);
  };

  const getTimeDifference = (time1: string, time2: string) => {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);
    const date1 = new Date();
    const date2 = new Date();
    date1.setHours(hours1, minutes1);
    date2.setHours(hours2, minutes2);
    return date1.getTime() - date2.getTime();
  };

  const sortBookingsByTime = (bookings: BookingRoom[]) => {
    return bookings.sort((a, b) => {
      const currentTimeDifference = getTimeDifference(currentTime, a.Start_Time);
      const nextTimeDifference = getTimeDifference(currentTime, b.Start_Time);
      return currentTimeDifference - nextTimeDifference;
    });
  };

  const filteredData = filterCurrentDateBookings(data);
  const sortedData = sortBookingsByTime(filteredData);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div style={{ width: '90%', margin: '0 auto', padding: '20px' }}>
      {/* ส่วนหัว */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '5px',
          backgroundColor: '#f5f5f5',
          borderBottom: '2px solid #bbdefb',
        }}
      >
        <Typography variant="h1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Haier
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Meeting Room Reservation List
        </Typography>
        <div>
          <Typography variant="subtitle2" sx={{ color: '#1976d2', textAlign: 'right' }}>
            {currentDate}
          </Typography>
          <Typography variant="h4" sx={{ color: '#1976d2', textAlign: 'right' }}>
            {currentTime}
          </Typography>
        </div>
      </div>

      {/* แสดงข้อมูลการประชุมที่กำลังเกิดขึ้น */}
      {currentMeeting && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Current Meeting
          </Typography>

          <Typography sx={{ color: '#1976d2' }}>
            <strong>Room:</strong> {currentMeeting.Room_Name}
          </Typography>
          <Typography sx={{ color: '#1976d2' }}>
            <strong>Time:</strong> {formatTime(currentMeeting.Start_Time)} - {formatTime(currentMeeting.End_Time)}
          </Typography>


          <Typography sx={{ color: '#1976d2' }}>
            <strong>Subject:</strong> {currentMeeting.Event_Name}
          </Typography>


          <Typography sx={{ color: '#1976d2' }}>
            <strong>Department:</strong> {currentMeeting.Department_Name}
          </Typography>
        </div>
      )}

      {/* ตารางข้อมูลการจอง */}
      <Table sx={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', marginTop: '20px' }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Room</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Time</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Subject</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Department</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((booking, index) => (
            <TableRow
              key={index}
              sx={{
                backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
                '&:hover': { backgroundColor: '#e3f2fd' },
              }}
            >
              <TableCell sx={{ textAlign: 'center' }}>{booking.Room_Name}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                {formatTime(booking.Start_Time)} - {formatTime(booking.End_Time)}
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{booking.Event_Name}</TableCell>
              <TableCell sx={{ textAlign: 'center' }}>{booking.Department_Name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ส่วนท้าย */}
        <a href="/utilities/meeting_room" style={{ textDecoration: 'none' }}>
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
  );
};

export default Bookingrooms;
