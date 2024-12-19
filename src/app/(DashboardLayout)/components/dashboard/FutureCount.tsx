import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { Typography, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { Grid, Card, CardContent } from '@mui/material';

interface Booking {
  Start_date: string;
}

const FutureCount = () => {
  const [futureBookings, setFutureBookings] = useState({
    totalFutureRooms: 0,
    totalFutureCars: 0
  });

  useEffect(() => {
    const fetchFutureBookings = async () => {
      try {
        const response = await fetch('/api/futureCount');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setFutureBookings({
              totalFutureRooms: data.totalFutureRooms,
              totalFutureCars: data.totalFutureCars
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

    fetchFutureBookings();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card   sx={{
          background: 'linear-gradient(to right, #f79d43, #f7d794)', // สีเหลืองอ่อน
          }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: 'white'
              }}
            >
              ล่วงหน้า
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
                {futureBookings.totalFutureRooms}
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
                {futureBookings.totalFutureCars}
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

export default FutureCount;