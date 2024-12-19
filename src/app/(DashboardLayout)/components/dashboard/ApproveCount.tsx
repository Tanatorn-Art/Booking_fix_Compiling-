import { Typography, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@mui/material';

interface Booking {
  Status: string;
}

const ApproveCount = () => {
  const [totalApprovedCount, setTotalApprovedCount] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [totalApproveRooms, setTotalApproveRooms] = useState<number>(0);
  const [totalApproveCars, setTotalApproveCars] = useState<number>(0);

  useEffect(() => {
    const fetchApprovedBookings = async () => {
      try {
        const response = await fetch('/api/approveCount');

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setTotalApprovedCount(data.totalApproved);
            setGrandTotal(data.grandTotal); // เพิ่มการเซ็ตค่า grandTotal
            setTotalApproveRooms(data.totalApproveRooms);
            setTotalApproveCars(data.totalApproveCars);
          }
        }

      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
      }
    };

    fetchApprovedBookings();
  }, []);
  return (
    <Card
      sx={{
        border: '2px solid #00CCCD',
        backgroundColor: 'transparent',
        height: '100px',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: 'rgba(0, 204, 205, 0.1)',
          transform: 'translateY(-3px)',
          boxShadow: '0 4px 8px rgba(0, 204, 205, 0.2)',
          cursor: 'pointer',
          '& .MuiTypography-root': {
            color: '#00CCCD !important'
          }
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent>
        <Typography
          variant="h6"
          sx={{
            mb: 0.5,
            color: '#00CCCD'
          }}
        >
          อนุมัติแล้ว
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
              color: '#00CCCD'
            }}
          >
            {isHovered ? `${totalApproveRooms}:${totalApproveCars}` : grandTotal}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: '#00CCCD'
            }}
          >
            {isHovered ? 'ห้อง:รถ' : 'รายการ'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
export default ApproveCount;