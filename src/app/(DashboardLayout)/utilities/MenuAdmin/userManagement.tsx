import { Typography, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@mui/material';

interface Booking {
  Status: string;
}
interface Props {
  onClick?: () => void;
}

const userManagement: React.FC<Props> = ({ onClick }) => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [usedUsers, setUsedUsers] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const fetchRoomManagement = async () => {
      try {
        const response = await fetch('/api/usersCount');
        const data = await response.json();

        // เพิ่ม console.log เพื่อดูข้อมูลที่ได้จาก API
        console.log('API Response:', data);

        if (data.success) {
          // ตรวจสอบให้แน่ใจว่าค่าที่ได้เป็นตัวเลข
          setTotalUsers(Number(data.totalUsers));
          setUsedUsers(Number(data.usedUsers));
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
      }
    };

    fetchRoomManagement();
  }, []);

  // เพิ่ม console.log เพื่อตรวจสอบค่า state
  console.log('Current state:', { totalUsers, usedUsers });

  return (
    <Card
      sx={{
        border: '2px solid #FF9933',
        backgroundColor: 'transparent',
        height: '100px',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: 'rgba(255, 236, 213, 0.6)',
          transform: 'translateY(-3px)',
          boxShadow: '0 4px 8px rgba(0, 204, 205, 0.2)',
          cursor: 'pointer',
          '& .MuiTypography-root': {
            color: '#FF9933 !important'
          }
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
       <CardContent>
        <Typography variant="h6" sx={{ mb: 0.5, color: '#FF9933' }}>
          รายการพนักงาน
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
            <Typography variant="h2" sx={{ fontSize: '1.5rem', color: '#FF9933' }}>
              แก้ไขพนักงาน
            </Typography>
          ) : (
            <>
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: '#FF9933' }}>
                {totalUsers} คน
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#FF9933' }}>
                  (ใช้งานอยู่ {usedUsers} ผู้ใช้งาน)
              </Typography>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
export default userManagement;