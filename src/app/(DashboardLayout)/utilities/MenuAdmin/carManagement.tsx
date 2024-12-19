import { Typography, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@mui/material';

interface Booking {
  Status: string;
}
interface Props {
  onClick?: () => void;
}

const carManagement: React.FC<Props> = ({ onClick }) => {
  const [totalCars, setTotalCars] = useState<number>(0);
  const [usedCars, setUsedCars] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const fetchRoomManagement = async () => {
      try {
        const response = await fetch('/api/carsCount');
        const data = await response.json();

        // เพิ่ม console.log เพื่อดูข้อมูลที่ได้จาก API
        console.log('API Response:', data);

        if (data.success) {
          // ตรวจสอบให้แน่ใจว่าค่าที่ได้เป็นตัวเลข
          setTotalCars(Number(data.totalCars));
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
      }
    };

    fetchRoomManagement();
  }, []);

  // เพิ่ม console.log เพื่อตรวจสอบค่า state
  console.log('Current state:', { totalCars, usedCars });

  return (
    <Card
    sx={{
      border: '2px solid #4CAF50',  // เปลี่ยนสีขอบ
      backgroundColor: 'transparent',
      height: '100px',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',  // เปลี่ยนสี hover
        transform: 'translateY(-3px)',
        boxShadow: '0 4px 8px rgba(76, 175, 80, 0.2)',  // เปลี่ยนสีเงา
        cursor: 'pointer',
        '& .MuiTypography-root': {
          color: '#4CAF50 !important'  // เปลี่ยนสีตัวอักษรเมื่อ hover
        }
      }
    }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
       <CardContent>
        <Typography variant="h6" sx={{ mb: 0.5, color: '#4CAF50' }}>
          รายการรถ
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
            <Typography variant="h2" sx={{ fontSize: '1.5rem', color: '#4CAF50' }}>
              แก้ไขรถ
            </Typography>
          ) : (
            <>
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: '#4CAF50' }}>
                {totalCars} คัน
              </Typography>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
export default carManagement;