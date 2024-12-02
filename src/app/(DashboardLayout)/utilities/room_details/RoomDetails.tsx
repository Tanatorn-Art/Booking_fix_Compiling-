'use client'; // Mark as Client Component
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/dashboard/PageContainer';
import 'bootstrap/dist/css/bootstrap.min.css';

type RoomDetails = {
  Room_ID: number;
  Room_Name: string;
  Capacity: number;
  Location: string;
};

type RoomProps = {
  data: RoomDetails[];
};

const RoomDetails = ({ data }: RoomProps) => {
  // ตรวจสอบว่า data มีค่าและเป็น array
  const rooms = Array.isArray(data) ? data : [];

  return (
    <PageContainer title="Room Details" description="List of all available rooms">
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          padding: '20px',
          marginTop: '20px',
          backgroundColor: '#fff',
        }}
      >
        <Typography sx={{ fontSize: '20px', marginBottom: '20px' }}>
          <strong>Rooms Details</strong>
        </Typography>
        <Table>
          <TableHead sx={{ backgroundColor: '#f9f9f9' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Room ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Room Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Capacity</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '14px' }}>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <TableRow
                  key={room.Room_ID}
                  sx={{
                    backgroundColor: room.Room_ID % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    },
                  }}
                >
                  <TableCell sx={{ fontSize: '14px' }}>{room.Room_ID}</TableCell>
                  <TableCell sx={{ fontSize: '14px' }}>{room.Room_Name}</TableCell>
                  <TableCell sx={{ fontSize: '14px' }}>{room.Capacity}</TableCell>
                  <TableCell sx={{ fontSize: '14px' }}>{room.Location}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: 'center', fontSize: '14px', color: '#555' }}>
                  No room details available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
};

export default RoomDetails;
