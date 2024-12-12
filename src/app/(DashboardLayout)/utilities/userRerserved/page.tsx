'use client';
import dynamic from 'next/dynamic';
// ไลบรารีที่ใช้ dynamic import
import { useState, useEffect } from 'react';
import { Typography} from '@mui/material';
import SpinnerIcon from '@rsuite/icons/Spinner';
const PageContainer = dynamic(() => import('@/app/(DashboardLayout)/components/dashboard/PageContainer'), { ssr: false });
const DashboardCard = dynamic(() => import('@/app/(DashboardLayout)/components/shared/DashboardCard'), { ssr: false });
import 'bootstrap/dist/css/bootstrap.min.css'; // ไม่จำเป็นต้อง dynamic เนื่องจากเป็นไฟล์ CSS
const UserReserved = dynamic(() => import('./UserReserved'), { ssr: false });
const UserReservedCars = dynamic(() => import('./UserReservedCars'), { ssr: false });
interface BookingRoom {
  Start_date: string;
  End_date: string;
  Start_Time: string;
  End_Time: string;
  Room_Name: string;
  Event_Name: string;
  Department_Name: string;
  participant: number;
  Status_Name: string;
}
const userRerserved = () => {
  const [data, setData] = useState<BookingRoom[]>([]); // กำหนด Type ให้ state
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/userbooking/'); // ดึงข้อมูลจาก API
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result.meetingRooms); // ใช้ข้อมูลจาก API
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SpinnerIcon spin style={{ fontSize: '2em', marginRight: '10px' }} />
        <span>Loading...</span>
      </div>
    );
  }
  return (
    <PageContainer title="Sample Page" description="This is a sample page">
      <DashboardCard title="">
        <div>
          <Typography variant="h3" sx={{marginLeft: 0, color: '#2196f3' }}>
            Booking History ( Room )
          </Typography>
          <br />
          <UserReserved />
          <br />
        </div>
      </DashboardCard>
      <br />
      <DashboardCard title="">
        <div>
          <Typography variant="h3" sx={{  marginLeft: 0, color: '#2196f3' }}>
            Booking History ( Car )
          </Typography>
          <br />
          <UserReservedCars />
          <br />
        </div>
      </DashboardCard>
    </PageContainer>
  );
};

export default userRerserved;
