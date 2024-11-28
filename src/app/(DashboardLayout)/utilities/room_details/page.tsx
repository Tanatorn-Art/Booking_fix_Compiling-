'use client'; // Mark the component as a Client Component

import { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/dashboard/PageContainer';
import 'bootstrap/dist/css/bootstrap.min.css';

// Define the RoomDetails type
interface RoomDetails {
  Room_ID: number;
  Room_Name: string;
  Capacity: number;
  Location: string;
}

const RoomDetailsPage = () => {
  const [data, setData] = useState<RoomDetails[]>([]);  // Room data state
  const [loading, setLoading] = useState(true);  // Loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/roomsDetails/');  // Fetch data from the API
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();  // Parse JSON response
        setData(result.meetingRooms);  // Set room data from the API
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);  // Set loading to false once data is fetched
      }
    };

    fetchData();  // Fetch room details
  }, []);  // Empty dependency array to fetch data only once

  if (loading) {
    return <div>Loading...</div>;  // Display loading message while fetching data
  }

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
        <Typography sx={{fontSize: '20px'}} >
          <strong>Rooms Details</strong>
        </Typography>
        <Table>
          <TableHead sx={{ backgroundColor: '#fffff' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Room ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Room Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Capacity</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((room, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)', // Subtle hover effect
                  },
                }}
              >
                <TableCell sx={{ fontSize: '14px', color: '#555' }}>{room.Room_ID}</TableCell>
                <TableCell sx={{ fontSize: '14px', color: '#555' }}>{room.Room_Name}</TableCell>
                <TableCell sx={{ fontSize: '14px', color: '#555' }}>{room.Capacity}</TableCell>
                <TableCell sx={{ fontSize: '14px', color: '#555' }}>{room.Location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
};

export default RoomDetailsPage;
