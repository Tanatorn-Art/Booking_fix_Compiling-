'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/dashboard/PageContainer';
// components
import SalesOverview from '@/app/(DashboardLayout)/components/dashboard/SalesOverview';
import YearlyBreakup from '@/app/(DashboardLayout)/components/dashboard/YearlyBreakup';
import RecentTransactions from '@/app/(DashboardLayout)/components/dashboard/RecentTransactions';
import ProductPerformance from '@/app/(DashboardLayout)/components/dashboard/ProductPerformance';
import Blog from '@/app/(DashboardLayout)/components/dashboard/Blog';
import MonthlyEarnings from '@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings';
import CalendarDateNosts from '@/app/(DashboardLayout)/components/dashboard/CalendarDateNosts';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import CountingRooms from '../../components/dashboard/CountingRooms';

const dashboardPage = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>

            <Grid>
              <div><CalendarDateNosts /></div>
            </Grid>

            <SalesOverview />
          </Grid>

          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>

              <Grid item xs={12}>
                <CountingRooms />
              </Grid>

              <Grid item xs={12}>
                <RecentTransactions />
              </Grid>
            </Grid>

          </Grid>
          <Grid item xs={12} lg={4}>
            <RecentTransactions />
          </Grid>
          <Grid item xs={12} lg={8}>
            <ProductPerformance />
          </Grid>
          <Grid item xs={12}>
            <Blog />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  )
}

export default dashboardPage;
