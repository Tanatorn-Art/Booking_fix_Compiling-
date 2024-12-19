import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { Typography, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { Grid, Card, CardContent } from '@mui/material';

interface Booking {
  Start_date: string;
}

const RequestCount = () => {
  const [requestCount, setRequestCount] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);

  useEffect(() => {
    const fetchApprovedBookings = async () => {
      try {
        const response = await fetch('/api/requestCount');

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setRequestCount(data.totalApproved);
            setGrandTotal(data.grandTotal); // เพิ่มการเซ็ตค่า grandTotal
          }
        }

      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
      }
    };

    fetchApprovedBookings();
  }, []);

  return (
    <Grid container spacing={3} >
      <Grid item xs={12}>
        <Card sx={{
            border: '2px solid #FF6666',
            backgroundColor: 'transparent',
            height: '100px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 102, 102, 0.1)', // เปลี่ยนเป็นสี #FF6666 แบบโปร่งใส
              transform: 'translateY(-3px)',
              boxShadow: '0 4px 8px rgba(255, 102, 102, 0.2)', // เปลี่ยนเงาเป็นสี #FF6666
              cursor: 'pointer',
              '& .MuiTypography-root': {
                color: '#FF6666 !important' // คงสีตัวอักษรเป็นสีแดงเดิม
              }
            }
        }}>

          <CardContent>
            <Typography
              variant="h6"
              sx={{
                mb: 0.5,
                color: '#FF6666'
              }}
            >
              รออนุมัติ
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
                  color: '#FF6666'
                }}
              >
                {grandTotal}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: '#FF6666'
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

export default RequestCount;