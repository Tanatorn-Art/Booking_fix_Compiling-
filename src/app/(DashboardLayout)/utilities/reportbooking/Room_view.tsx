'use client'
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
// ใช้ dynamic import สำหรับแต่ละ Component
const Typography = dynamic(() => import('@mui/material/Typography'), { ssr: false, loading: () => <p>Loading Typography...</p> });
const Table = dynamic(() => import('@mui/material/Table'), { ssr: false, loading: () => <p>Loading Table...</p> });
const TableHead = dynamic(() => import('@mui/material/TableHead'), { ssr: false, loading: () => <p>Loading TableHead...</p> });
const TableBody = dynamic(() => import('@mui/material/TableBody'), { ssr: false, loading: () => <p>Loading TableBody...</p> });
const TableRow = dynamic(() => import('@mui/material/TableRow'), { ssr: false, loading: () => <p>Loading TableRow...</p> });
const TableCell = dynamic(() => import('@mui/material/TableCell'), { ssr: false, loading: () => <p>Loading TableCell...</p> });
//ใช้การ import แบบ Dynamic จะทำการโหลดอันที่พร้อมแล้วมาไว้ก่อน ส่วนอันที่ยังช้าอยู่จะตามมาทีหลัง
//จะได้ไม่ต้องรอโหลดพร้อมกัน
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
  const [currentMeetings, setCurrentMeetings] = useState<BookingRoom[]>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setCurrentTime(time);
      const date = formatDate(now.toISOString());
      setCurrentDate(date);

      // กรองการประชุมเฉพาะวันปัจจุบัน
      const todayMeetings = filterCurrentDateBookings(data);

      // แก้ไขการค้นหาการประชุมที่กำลังเกิดขึ้น
      const ongoingMeetings = todayMeetings.filter((booking) => {
        const currentTimeMinutes = convertTimeToMinutes(currentTime);
        const startTimeMinutes = convertTimeToMinutes(booking.Start_Time);
        const endTimeMinutes = convertTimeToMinutes(booking.End_Time);

        return currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes;
      });

      setCurrentMeetings(ongoingMeetings);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [data, currentTime]);
  const convertTimeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
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


  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };
  const formatTime = (time: string) => time.slice(0, 5);

  const filterCurrentDateBookings = (bookings: BookingRoom[]) => {
    const today = new Date();
    const formattedDate = formatDate(today.toISOString());
    const currentTime = today.toLocaleTimeString('en-US', { hour12: false }).slice(0, 5);

    return bookings.filter((booking) => {
      const bookingDate = formatDate(booking.Start_date);
      // แสดงเฉพาะการจองของวันนี้และเวลาที่ยังไม่ผ่านไป
      if (bookingDate === formattedDate) {
        return booking.End_Time >= currentTime ||
        (booking.Start_Time <= currentTime && booking.End_Time >= currentTime);
      }
      return false;
    });
  };

  const sortBookingsByTime = (bookings: BookingRoom[]) => {
    return bookings.sort((a, b) => {
      // เรียงตามเวลาเริ่มต้น
      return a.Start_Time.localeCompare(b.Start_Time);
    });
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

  const filteredData = filterCurrentDateBookings(data);
  const sortedData = sortBookingsByTime(filteredData);

  if (loading) {
    return <div>Loading...</div>;
  }
  const scrollStyles = `
      @keyframes scrollLeft {
        0% { transform: translateX(0); }
        100% { transform: translateX(-${12.5}%); } /* ปรับตามจำนวนชุดข้อความ (100/8) */
      }
      .scroll-container {
        display: flex;
        animation: scrollLeft 10s linear infinite;
      }
      .scroll-container:hover {
        animation-play-state: paused;
      }
    `;

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
      <style jsx global>{scrollStyles}</style>
      <div >
        {/* ... Current Meeting ... */}
        {currentMeetings.length > 0 && (
        <div style={{
          marginTop: '20px',
          padding: '45px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <div className="scroll-container" style={{
            animation: 'scrollLeft 60s linear infinite',
            whiteSpace: 'nowrap',
            width: 'fit-content'
          }}>
            {/* สร้างชุดข้อความหลายชุดเพื่อทำ infinite scroll */}
            {[...Array(8)].map((_, arrayIndex) => ( // เพิ่มจำนวนชุดข้อความเป็น 8 ชุด
              <Typography
                key={`text-set-${arrayIndex}`}
                sx={{
                  color: '#1976d2',
                  fontSize: '45px',
                  display: 'inline-block',
                  '& strong': {
                    marginRight: '8px',
                    marginLeft: '8px'
                  }
                }}
              >
                {currentMeetings.map((meeting, meetingIndex) => (
                  <React.Fragment key={`meeting-${arrayIndex}-${meetingIndex}`}>
                    <strong>[ {meeting.Room_Name} ]</strong>
                    {meeting.Event_Name}
                    <strong>[ {formatTime(meeting.Start_Time)}-{formatTime(meeting.End_Time)} ]</strong>
                    <span style={{ margin: '0 20px' }}>•</span> {/* เพิ่มตัวคั่นระหว่างรายการ */}
                  </React.Fragment>
                ))}
              </Typography>
            ))}
          </div>
        </div>
      )}

      {/* ตารางข้อมูลการจอง */}
      <Table sx={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', marginTop: '20px' }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Room</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Time</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: '450px' }}>Subject</TableCell>
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
              <TableCell sx={{}}>{booking.Event_Name}</TableCell>
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
    </div>
  );
};

export default Bookingrooms;
