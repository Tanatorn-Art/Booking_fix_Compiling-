'use client';
import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/dashboard/PageContainer';
import Room_view from '@/app/(DashboardLayout)/components/dashboard/Room_view';

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

const roombook_view = () => {
  const [data, setData] = useState<BookingRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/bookingrooms/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
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
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (time: string) => time.slice(0, 5);

  const formatDateRange = (startDate: string, endDate: string) => {
    const startFormatted = formatDate(startDate);
    const endFormatted = formatDate(endDate);
    return `${startFormatted} - ${endFormatted}`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const getCurrentDate = () => {
    const currentDate = new Date();
    return formatDate(currentDate.toISOString());
  };

  return (
    <div>
      {/* Conditionally render the content without navigation bar */}
        <Typography variant="h5" sx={{ marginTop: 2, marginLeft: 3 }}>
          Meeting Rooms : {getCurrentDate()}
        </Typography>
        <br />
        <Room_view />
        <br />
        <br />
    </div>
  );
};

export default roombook_view;
