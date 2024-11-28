'use client';
import { useState, useEffect } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Chip } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/dashboard/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import CalendarDatePic from '@/app/(DashboardLayout)/components/dashboard/CalendarDate';
import ReserveList from '../../components/dashboard/ReserveList';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserReserved from '@/app/(DashboardLayout)/components/dashboard/UserReserved';

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

const userRerserved = () => {
  const [data, setData] = useState<BookingRoom[]>([]); // กำหนด Type ให้ state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/userbooking/'); // ดึงข้อมูลจาก API
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


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer title="Sample Page" description="This is a sample page">
      <DashboardCard title="">
        <Typography variant="h5" sx={{ marginTop: 2, marginLeft: 3 }}>
          Meeting Rooms
        </Typography>
        {/* รายการอื่น ๆ */}
        <br></br>
        {/* ตารางแสดงข้อมูล */}
        <UserReserved/>

        <br />
        <br />
      </DashboardCard>
    </PageContainer>
  );
};

export default userRerserved;
