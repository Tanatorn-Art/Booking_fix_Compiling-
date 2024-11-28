import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineOppositeContentClasses,
} from '@mui/lab';
import { Typography } from '@mui/material';
import { useState, useEffect } from 'react';

// ฟังก์ชัน formatDate สำหรับแปลงวันที่เป็นรูปแบบ dd-MM-yyyy
const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มต้นจาก 0
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; // รูปแบบ dd-MM-yyyy
};

interface Booking {
  Start_Time: string; // เวลาที่จอง
  Room_Name: string;  // ชื่อห้องที่จอง
  participant: string; // จำนวนผู้เข้าร่วม
  Start_date: string; // วันที่เริ่มการจอง
}

const RecentTransactions = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // ดึงข้อมูลการจองที่อนุมัติในวันนี้
        const response = await fetch('/api/roomToday');
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched data:", data);  // แสดงข้อมูลที่ได้จาก API
          if (data.success && Array.isArray(data.meetingRooms)) {
            setBookings(data.meetingRooms);
          } else {
            console.error('Invalid data format:', data);
          }
        } else {
          console.error('Failed to fetch booking data, status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching booking data:', error);
      }
    };

    fetchBookings();
  }, []);

  // ฟังก์ชันสำหรับการดึงวันที่ปัจจุบันในรูปแบบ dd-MM-yyyy
  const getCurrentDate = () => {
    const currentDate = new Date();
    return formatDate(currentDate.toISOString()); // แปลงวันที่เป็นรูปแบบ dd-MM-yyyy
  };

  const currentDate = getCurrentDate();  // ใช้ฟังก์ชันเพื่อรับวันที่ปัจจุบันในรูปแบบ dd-MM-yyyy
  console.log("Current Date:", currentDate);  // ตรวจสอบวันที่ปัจจุบัน

  const filteredBookings = bookings
    .filter((booking) => {
      // แปลง Start_date จาก booking เป็นรูปแบบ dd-MM-yyyy
      const formattedBookingDate = formatDate(booking.Start_date);
      return formattedBookingDate === currentDate; // กรองเฉพาะวันที่ตรงกับปัจจุบัน
    })
    .sort((a, b) => a.Start_Time.localeCompare(b.Start_Time)); // จัดลำดับตามเวลา

  // ฟังก์ชันสำหรับการแปลงเวลาเป็นรูปแบบ HH:mm
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  return (
    <DashboardCard title="Meeting Transactions">
      <Timeline
        className="theme-timeline"
        sx={{
          p: 0,
          mb: '-40px',
          '& .MuiTimelineConnector-root': {
            width: '1px',
            backgroundColor: '#efefef',
          },
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0.5,
            paddingLeft: 0,
          },
        }}
      >
        {filteredBookings.length === 0 ? (
          <Typography align="center" color="text.secondary">
            No transactions for today.
          </Typography>
        ) : (
          filteredBookings.map((booking, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent>
                {formatTime(booking.Start_Time)} {/* แสดงเวลาในรูปแบบ HH:mm */}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="primary" variant="outlined" />
                {index < filteredBookings.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Typography fontWeight="600">{booking.Room_Name}</Typography>
                <Typography style={{ color: 'blue' }}>
                  {`${Number(booking.participant)} participants`}
                </Typography>
              </TimelineContent>
            </TimelineItem>
          ))
        )}
      </Timeline>
    </DashboardCard>
  );
};

export default RecentTransactions;
