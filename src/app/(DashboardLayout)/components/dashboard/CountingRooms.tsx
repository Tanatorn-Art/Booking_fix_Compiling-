import React, { useEffect, useState } from 'react';
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar } from '@mui/material';
import { IconArrowUpLeft } from '@tabler/icons-react';

import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import RecentTransactions from '@/app/(DashboardLayout)/components/dashboard/RecentTransactions';


const CountingRooms = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = '#ecf2ff';
  const successlight = theme.palette.success.light;

  const [roomData, setRoomData] = useState<{
    totalRooms: number;
    yearlyChange: number;
    usedRooms: number; // ห้องที่จองในปัจจุบัน
    unusedRooms: number; // ห้องที่ไม่ได้ใช้ในปัจจุบัน
  } | null>(null);

  useEffect(() => {
    // ฟังก์ชันดึงข้อมูลจาก API
    const fetchRoomData = async () => {
      try {
        const response = await fetch('/api/roomsCount'); // URL ของ API
        if (response.ok) {
          const data = await response.json();
          // ลดจำนวนห้องที่ใช้งานลง 1 ห้อง
          setRoomData({
            totalRooms: data.totalRooms,
            yearlyChange: data.yearlyChange,
            usedRooms: data.usedRooms - 1, // ลดห้องที่ใช้งานลง 1 ห้อง
            unusedRooms: data.totalRooms - (data.usedRooms - 1), // คำนวณห้องที่ไม่ได้ใช้
          });
        } else {
          console.error('Failed to fetch room data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    fetchRoomData();
  }, []);

  // Chart options and data
  const optionscolumnchart: any = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 155,
    },
    colors: ['#4ac76e', '#E5E5E5', '#F9F9FD'], // สีของห้องที่ใช้และไม่ได้ใช้
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
          background: 'transparent',
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };

  // ตัวเลขกราฟที่ใช้ (อัปเดตตาม roomData)
  const seriescolumnchart: any = roomData
    ? [roomData.usedRooms, roomData.unusedRooms, roomData.totalRooms - roomData.usedRooms - roomData.unusedRooms]
    : [0, 0, 0];

  return (
    <DashboardCard title="Meeting Rooms">
      <Grid container spacing={3}>
        {/* column */}
        <Grid item xs={7} sm={7}>
          <Typography variant="h3" fontWeight="700">
            Rooms: {roomData ? roomData.totalRooms : 'Loading...'}
          </Typography>

          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
              <IconArrowUpLeft width={20} color="#39B69A" />
            </Avatar>

            <Typography variant="subtitle2" fontWeight="600">
              {/* แสดงวันที่ปัจจุบัน */}
              {new Date().toLocaleDateString('th-TH', {
                weekday: 'long', // วันในสัปดาห์
                year: 'numeric', // ปี
                month: 'long', // เดือน
                day: 'numeric', // วัน
              })}
            </Typography>
          </Stack>


          <Stack spacing={3} mt={5} direction="row">
          {/* จำนวนห้องที่ใช้ปัจจุบัน */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ width: 9, height: 9, bgcolor: '#4caf50', svg: { display: 'none' } }} />
            <Typography variant="subtitle2" color="#4caf50" sx={{ fontSize: '1.1rem' }}> {/* เพิ่มขนาดข้อความสำหรับห้องที่ใช้ */}
              {roomData ? roomData.usedRooms : '...'} ห้องที่จอง
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={3} mt={1} direction="row">
          {/* จำนวนห้องที่ไม่ได้ใช้ปัจจุบัน */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ width: 9, height: 9, bgcolor: '#B9B9B9', svg: { display: 'none' } }} />
            <Typography variant="subtitle2" color="#B9B9B9" sx={{ fontSize: '1.1rem' }}> {/* เพิ่มขนาดข้อความสำหรับห้องที่ไม่ได้ใช้ */}
              {roomData ? roomData.unusedRooms : '...'} ห้องที่ไม่ได้จอง
            </Typography>
          </Stack>
        </Stack>


        </Grid>


        {/* column */}
        <Grid item xs={5} sm={5}>
          <Chart
            options={optionscolumnchart}
            series={seriescolumnchart}
            type="donut"
            height={150}
            width={"100%"}
          />
        </Grid>
      </Grid>

    </DashboardCard>

  );
};

export default CountingRooms;
