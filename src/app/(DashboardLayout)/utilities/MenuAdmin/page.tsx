'use client'
import { Grid } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/dashboard/PageContainer';
import { useState, useEffect } from 'react';
import RoomManagement from './roomManagement';
import CarManagement from './carManagement';
import UserManagement from './userManagement';
import RoomTable from './tables/RoomTable';
import CarTable from './tables/CarTable';
import UserTable from './tables/UserTable';
import { fetchRoomDetails } from './fetchRoomDetails';
import { fetchCarDetails } from './fetchCarDetails';

const DashboardBtn = () => {
  const [activeTable, setActiveTable] = useState<string | null>(null);
  const [roomsDetails, setRoomsDetails] = useState([]);
  const [carsDetails, setCarsDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchRoomDetails();
      const carData = await fetchCarDetails();
      setRoomsDetails(data);
      setCarsDetails(carData);
    };
    fetchData();
  }, []);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={4}>
              <RoomManagement onClick={() => setActiveTable('room')} />
            </Grid>
            <Grid item xs={4}>
              <CarManagement onClick={() => setActiveTable('car')} />
            </Grid>
            <Grid item xs={4}>
              <UserManagement onClick={() => setActiveTable('user')} />
            </Grid>
          </Grid>
        </Grid>

        {/* แสดงตารางตาม state */}
        <Grid item xs={12}>
          {activeTable === 'room' && <RoomTable data={roomsDetails} />}
          {activeTable === 'car' && <CarTable data={carsDetails} />}
          {activeTable === 'user' && <UserTable />}
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default DashboardBtn;
