'use client';
import { useState, useEffect } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Chip } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/dashboard/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import CalendarDatePic from '@/app/(DashboardLayout)/components/dashboard/CalendarDate';
import ReserveList from '../../components/dashboard/ReserveList';
import 'bootstrap/dist/css/bootstrap.min.css';
import Bookingrooms from '@/app/(DashboardLayout)/components/dashboard/Room_view';

interface BookingRoom {
  Start_date: string;
  End_date: string;
  Start_Time: string;
  End_Time: string;
  Room_Name: string;
  Event_Name: string;
  Department_Name: string;
  participant: number;
  Status_Name: string;
}

const SamplePage = () => {
  const [data, setData] = useState<BookingRoom[]>([]); // กำหนด Type ให้ state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/bookingrooms/'); // ดึงข้อมูลจาก API
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result.meetingRooms); // ใช้ข้อมูลจาก API
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ฟังก์ชันจัดรูปแบบวันที่ในรูปแบบ dd/MM/yyyy
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate); // แปลงเป็น Date object
    const day = String(date.getDate()).padStart(2, '0'); // เพิ่ม 0 หน้าเมื่อวันที่น้อยกว่า 10
    const month = String(date.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มต้นจาก 0 (มกราคมคือ 0)
    const year = date.getFullYear(); // ปีเต็ม
    return `${day}/${month}/${year}`; // คืนค่าตามรูปแบบ dd/MM/yyyy
  };

  // ฟังก์ชันจัดรูปแบบเวลา
  const formatTime = (time: string) => time.slice(0, 5); // ตัดวินาที .00 ออก

  // ฟังก์ชันจัดการวันที่เริ่มต้นและวันที่สิ้นสุด
  const formatDateRange = (startDate: string, endDate: string) => {
    const startFormatted = formatDate(startDate);
    const endFormatted = formatDate(endDate);
    return `${startFormatted} - ${endFormatted}`; // แสดงช่วงวันที่
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  const getCurrentDate = () => {
    const currentDate = new Date();
    return formatDate(currentDate.toISOString());
  };

  return (
    <PageContainer title="Sample Page" description="This is a sample page">
      <DashboardCard title="">
        <Typography variant="h5" sx={{ marginTop: 2, marginLeft: 3 }}>
          Meeting Rooms : {getCurrentDate()}
        </Typography>
        <div>
          <CalendarDatePic />
        </div>
        <br></br>
        {/* ตารางแสดงข้อมูล */}
        <Bookingrooms/>

        <br />
        <br />
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;
