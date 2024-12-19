import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { Typography, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { Grid, Card, CardContent } from '@mui/material';

interface Booking {
  Start_date: string;
}

const CurrentCount = () => {
  const [currentBookings, setCurrentBookings] = useState({
    totalCurrentRooms: 0,
    totalCurrentCars: 0
  });

  useEffect(() => {
    const fetchCurrentBookings = async () => {
      try {
        const response = await fetch('/api/currentCount');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCurrentBookings({
              totalCurrentRooms: data.totalCurrentRooms,
              totalCurrentCars: data.totalCurrentCars
            });
          } else {
            console.error('รูปแบบข้อมูลไม่ถูกต้อง:', data);
          }
        } else {
          console.error('ไม่สามารถดึงข้อมูลการจองได้, สถานะ:', response.status);
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
      }
    };

    fetchCurrentBookings();
  }, []);

  return (
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <Card   sx={{
          background: 'linear-gradient(to right, #3fb861, #9edeb0)', // ไล่สีจากเขียวค่อนข้างเข้มไปอ่อน
        }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: 'white'
            }}
          >
            ปัจจุบัน
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              p: 1,
              gap: 2,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontSize: '2rem',
                color: 'white'
              }}
            >
              {currentBookings.totalCurrentRooms}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'white'
              }}
            >
              รายการ
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: '2rem',
                color: 'white'
              }}
            >
              {currentBookings.totalCurrentCars}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'white'
              }}
            >
              รายการ
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);
};

export default CurrentCount;