'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/dashboard/PageContainer';
// components
import CalendarDateRoom from '@/app/(DashboardLayout)/components/dashboard/CalendarDateRoom';
import CalendarDateCar from '@/app/(DashboardLayout)/components/dashboard/CalendarDateCar';
import CountingRooms from '../../components/dashboard/CountingRooms';
import CurrentCount from '../../components/dashboard/CurrentCount';
import FutureCount from '../../components/dashboard/FutureCount';
import PastCount from '../../components/dashboard/PastCount';
import ApproveCount from '../../components/dashboard/ApproveCount';
import RequestCount from '../../components/dashboard/RequestCount';
import ClockandDate from '../../components/dashboard/ClockandDate';
import CountingCars from '../../components/dashboard/CountingCars';
import EventMap from '../EventMap/page';

const dashboardPage = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">


      <Grid container spacing={2} style={{marginBottom:'20px'}}>  {/* เพิ่ม container และ spacing */}
        <Grid item xs={12} md={4}>  {/* แบ่งพื้นที่เป็น 3 ส่วนเท่าๆ กัน */}
          <Box>
            <PastCount />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box>
            <CurrentCount />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box>
            <FutureCount />
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ marginBottom: "20px" }}>

        <Grid container spacing={3}>

          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <CountingRooms />
              </Grid>
            </Grid>
          </Grid>

          {/* mid */}
          <Grid item xs={12} md={4} mt={0}>
            <Grid item xs={12}>
              <Box>
                <ClockandDate />
              </Box>
            </Grid>
            <Grid container spacing={2} mt={0}>  {/* เพิ่ม container และ spacing */}
              <Grid item xs={6}>  {/* แบ่งพื้นที่เป็น 2 ส่วนเท่าๆ กัน */}
                <Box>
                  <ApproveCount />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box>
                  <RequestCount />
                </Box>
              </Grid>
            </Grid>
          </Grid>
          {/* end mid */}

          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <CountingCars />
              </Grid>
            </Grid>
          </Grid>

        </Grid>
      </Box>
      {/* ----- */}

      <Box>
        <Grid item xs={12} lg={8}>
          <Grid>
            {/* <SalesOverview /> */}
          </Grid>
          {/* จัด Calendar ให้อยู่ข้างกัน */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <div><CalendarDateRoom /></div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div><CalendarDateCar /></div>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {/* <div><EventMap /></div> */}
{/*
      <Grid item xs={12} lg={8}>
        <ProductPerformance />
      </Grid> */}
    </PageContainer>
  )
}

export default dashboardPage;
