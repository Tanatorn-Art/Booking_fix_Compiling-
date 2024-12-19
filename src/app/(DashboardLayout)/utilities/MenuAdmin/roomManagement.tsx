import { Typography, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@mui/material';

interface Props {
  onClick?: () => void;
}

interface Booking {
  Status: string;
}

const RoomManagement: React.FC<Props> = ({ onClick }) => {
  const [totalRooms, setTotalRooms] = useState<number>(0);
  const [usedRooms, setUsedRooms] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const fetchRoomManagement = async () => {
      try {
        const response = await fetch('/api/roomsCount');
        const data = await response.json();

        // เพิ่ม console.log เพื่อดูข้อมูลที่ได้จาก API
        console.log('API Response:', data);

        if (data.success) {
          // ตรวจสอบให้แน่ใจว่าค่าที่ได้เป็นตัวเลข
          setTotalRooms(Number(data.totalRooms));
          setUsedRooms(Number(data.usedRooms));
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
      }
    };

    fetchRoomManagement();
  }, []);

  // เพิ่ม console.log เพื่อตรวจสอบค่า state
  console.log('Current state:', { totalRooms, usedRooms });

  return (
    <Card
      sx={{
        border: '2px solid #0080FF',
        backgroundColor: 'transparent',
        height: '100px',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: 'rgba(236, 241, 255, 0.8)',
          transform: 'translateY(-3px)',
          boxShadow: '0 4px 8px rgba(0, 204, 205, 0.2)',
          cursor: 'pointer',
          '& .MuiTypography-root': {
            color: '#0080FF !important'
          }
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
       <CardContent>
        <Typography variant="h6" sx={{ mb: 0.5, color: '#0080FF' }}>
          รายการห้อง
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            p: 1,
            gap: 1,
          }}
        >
          {isHovered ? (
            <Typography variant="h2" sx={{ fontSize: '1.5rem', color: '#0080FF' }}>
              แก้ไขห้อง
            </Typography>
          ) : (
            <>
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: '#0080FF' }}>
                {totalRooms} ห้อง
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#0080FF' }}>
                (ใช้งานอยู่ {usedRooms} ห้อง)
              </Typography>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RoomManagement;