'use client'
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { IconArrowNarrowDown, IconCornerDownRightDouble } from '@tabler/icons-react';
import {IconCornerRightDownDouble} from '@tabler/icons-react';
import {IconArrowNarrowRight} from '@tabler/icons-react';
interface Room {
  id: string;
  name: string;
  capacity: number;
  isAvailable: boolean;
  floor: string;
  facilities: string[];
}

const EventMap = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      const data = await response.json();
      if (data.success) {
        setRooms(data.meetingRooms);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setError('ไม่สามารถโหลดข้อมูลห้องได้');
    }
  };

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
    setIsBookingModalOpen(true);
  };
  return (
    <Box sx={{ p: 2, height: '100vh' }}>
      {error && <Alert severity="error">{error}</Alert>}

      <Box
        sx={{
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          bgcolor: 'background.paper',
          p: 3,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', color: 'white', bgcolor: '#0066b2', p: 1 }}>
          แผนผังห้องประชุมโรงงานผลิตตู้เย็น ชั้น 2
        </Typography>

        <Box sx={{ position: 'relative', border: '1px solid #ccc', p: 0}}>
          {/* ส่วนบน */}
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>

          {/* ห้อง RF-206 และ RF-207 */}
          <Box sx={{ width: '30%' }}>
            {/* arrow */}
            <div style={{position: 'absolute', top: '0', left: '0', zIndex: 1000, marginTop: '10px', marginLeft: '20px', color: 'green'}}>
              <IconCornerDownRightDouble />
            </div>
            <div style={{position: 'absolute', top: '0', left: '0', zIndex: 1000, marginTop: '14px', marginLeft: '170px', color: 'green'}}>
              <IconArrowNarrowRight />
            </div>
            <div style={{position: 'absolute', top: '0', left: '0', zIndex: 1000, marginTop: '20px', marginLeft: '330px', color: 'green'}}>
              <IconCornerRightDownDouble />
            </div>
            <div style={{position: 'absolute', top: '0', left: '0', zIndex: 1000, marginTop: '150px', marginLeft: '332px', color: 'green'}}>
              <IconArrowNarrowDown />
            </div>
            {/* arrow */}
            <RoomBox
              room={{ id: 'RF-206', name: 'RF-206', capacity: 0, isAvailable: true, floor: '2', facilities: [] }}
              onClick={handleRoomClick}
              sx={{
                mt: 5,
                height: '290px',
                border: '1px solid #ccc',
                '&:hover': { // ลบ hover effect
                  bgcolor: 'transparent',
                  border: '1px solid #ccc'
                }
              }}
            />

            <Box sx={{ height: '20px' }} />

            <RoomBox
              room={{ id: 'RF-207', name: 'RF-207', capacity: 0, isAvailable: true, floor: '2', facilities: [] }}
              onClick={handleRoomClick}
              sx={{
                height: '100px',
                border: '1px solid #ccc',
                '&:hover': { // ลบ hover effect
                  bgcolor: 'transparent',
                  border: '1px solid #ccc'
                }
              }}
            />
          </Box>

            {/* ห้องเล็กๆ ตรงกลาง */}
            <Box sx={{ width: '10%', display: 'flex', flexDirection: 'column', gap: '8px' , ml: 4}}>
              {/* RF-201 แยกออกมาต่างหาก เพื่อกำหนดขนาดใหญ่ขึ้น */}
              <RoomBox
                room={{ id: 'RF-201', name: 'RF-201', capacity: 0, isAvailable: true, floor: '2', facilities: [] }}
                onClick={handleRoomClick}
                sx={{ height: '80px' }}
              />

              {/* ห้องที่เหลือ */}
              {['RF-203', 'RF-202', 'RF-204'].map((roomId) => (
                <RoomBox
                  key={roomId}
                  room={{ id: roomId, name: roomId, capacity: 0, isAvailable: true, floor: '2', facilities: [] }}
                  onClick={handleRoomClick}
                  sx={{ height: '50px' , width: '75px', ml: 4}}
                />
              ))}
            </Box>

            {/* Production Area */}
            <Box sx={{
              flex: 1,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #ccc',
              height: '255px' // กำหนดความสูงที่แน่นอน
            }}>
              <Typography variant="h6">Production Area</Typography>
            </Box>
          </Box>

          {/* ส่วนล่าง */}
          <Box sx={{
            display: 'flex',
            gap: 1,
            justifyContent: 'flex-end',
            mt: '-132px', // ปรับเป็นค่าติดลบเพื่อให้ขยับขึ้นไปซ้อนกับ Production Area
            mr: '363px',
          }}>
            {/* ห้องด้านล่าง */}
            {['RF-208', 'RF-209', 'RF-210'].map((roomId) => (
              <RoomBox
                key={roomId}
                room={{ id: roomId, name: roomId, capacity: 0, isAvailable: true, floor: '2', facilities: [] }}
                onClick={handleRoomClick}
                sx={{
                  width: '65px',
                  height: '100px'
                }}
              />
            ))}
          </Box>

        </Box>
      </Box>

      {/* Modal */}
      <Dialog open={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)}>
        {/* ... existing dialog content ... */}
      </Dialog>
    </Box>
  );
};

// RoomBox component
const RoomBox = ({ room, onClick, sx = {} }: {
  room: Room;
  onClick: (room: Room) => void;
  sx?: Record<string, any>;
}) => (
  <Box
    sx={{
      p: 1,
      border: '1px solid #000',
      cursor: 'pointer',
      textAlign: 'center',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': {
        bgcolor: '#0066b2',
      },
      ...sx
    }}
    onClick={() => onClick(room)}
  >
    <Typography variant="caption">{room.name}</Typography>
  </Box>
);

export default EventMap;