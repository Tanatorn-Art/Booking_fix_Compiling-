import { Typography, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { Grid, Card, CardContent  } from '@mui/material';

interface Booking {
  Start_date: string;
}
type PastCountResult = {
  totalPastRooms: number;
  totalPastCars: number;
};

const PastCount = () => {
  const [PastRoomBookingsCount, setPastRoomBookingsCount] = useState<number>(0);
  const [PastCarBookingsCount, setPastCarBookingsCount] = useState<number>(0);

  useEffect(() => {
    const fetchPastBookings = async () => {
      try {
        const response = await fetch('/api/pastCount');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setPastRoomBookingsCount(data.totalPastRooms);
            setPastCarBookingsCount(data.totalPastCars);
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

    fetchPastBookings();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
      <Card sx={{
          background: 'linear-gradient(to right,  rgba(74, 108, 189, 1),rgba(138, 161, 227, 0.8))', // ปรับค่า alpha เพื่อควบคุมความโปร่งใส
          boxShadow: '2px 2px 2px 2px grey.20'
      }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: 'white'
              }}
            >
              ผ่านมาแล้ว
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
                {PastRoomBookingsCount}
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
                {PastCarBookingsCount}
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

export default PastCount;