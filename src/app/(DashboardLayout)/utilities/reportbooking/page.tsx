'use client';
import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/dashboard/PageContainer';
import Room_view from '@/app/(DashboardLayout)/components/dashboard/Room_view';

const roombook_view = () => {
  return (

    <div >
        <Room_view />
    </div>
  );
};

export default roombook_view;
