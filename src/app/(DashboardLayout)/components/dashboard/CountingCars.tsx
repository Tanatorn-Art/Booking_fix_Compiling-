import React, { useEffect, useState } from 'react';
import dynamic from "next/dynamic";
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar , Card} from '@mui/material';
import { IconArrowUpLeft } from '@tabler/icons-react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

// แก้ไขการ import Chart
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

const CountingCars = () => {
  const theme = useTheme();
  const successlight = theme.palette.success.light;

  const [carData, setCarData] = useState<{
    totalCars: number;
    yearlyChange: number;
    reservedCars: number;
    availableCars: number;
  } | null>(null);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchRoomData = async () => {
      try {
        const response = await fetch('/api/carsCount');
        if (response.ok) {
          const data = await response.json();
          setCarData({
            totalCars: data.totalCars,
            yearlyChange: data.yearlyChange || 0,
            reservedCars: data.usedCars || 0,
            availableCars: data.totalCars - (data.usedCars || 0),
          });
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    fetchRoomData();
  }, []);

  const chartOptions = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 155,
    },
    colors: ['#4ac76e', '#E5E5E5', '#F9F9FD'],
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          background: 'transparent',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };

  const chartSeries = carData ? [
    carData.reservedCars,
    carData.availableCars,
    0
  ] : [0, 0, 0];

  return (
    <Card sx={{ padding: 3, boxShadow: 1 }}>

      <Grid container spacing={3}>
        <Grid item xs={7} sm={7}>
          <Typography variant="h3" fontWeight="700">
            Cars: {carData ? carData.totalCars : 'Loading...'}
          </Typography>

          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
              <IconArrowUpLeft width={20} color="#39B69A" />
            </Avatar>
            <Typography variant="subtitle2" fontWeight="600">
              รถทั้งหมด
            </Typography>
          </Stack>

          <Stack spacing={3} mt={5} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 9, height: 9, bgcolor: '#4caf50', svg: { display: 'none' } }} />
              <Typography variant="subtitle2" color="#4caf50" sx={{ fontSize: '1.1rem' }}>
                {/* {carData ? carData.reservedCars : '...'} */}
                รถที่จอง
              </Typography>
            </Stack>
          </Stack>

          <Stack spacing={3} mt={1} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 9, height: 9, bgcolor: '#B9B9B9', svg: { display: 'none' } }} />
              <Typography variant="subtitle2" color="#B9B9B9" sx={{ fontSize: '1.1rem' }}>
                {carData ? carData.availableCars : '...'} รถที่ไม่ได้จอง
              </Typography>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={5} sm={5}>
          {isClient && (
            <ReactApexChart
              options={chartOptions as any}
              series={chartSeries}
              type="donut"
              height={150}
              width="100%"
            />
          )}
        </Grid>
      </Grid>
    </Card>
  );
};

export default CountingCars;