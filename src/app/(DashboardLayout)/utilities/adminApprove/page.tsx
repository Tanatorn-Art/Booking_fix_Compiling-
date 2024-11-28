'use client';
import { useState, useEffect } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Button } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/dashboard/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { Check, Close } from '@mui/icons-material';

interface BookingRoom {
  Booking_ID: number;
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

interface BookingDetailsProps {
  bookingId: string;
}

const adminApprove: React.FC<BookingDetailsProps> = ({ bookingId }) => {
  const [data, setData] = useState<BookingRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/bookingrooms/${bookingId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result.meetingRooms);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId]);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (time: string) => time.slice(0, 5);

  const formatDateRange = (startDate: string, endDate: string) => {
    const startFormatted = formatDate(startDate);
    const endFormatted = formatDate(endDate);
    return `${startFormatted} - ${endFormatted}`;
  };

  const handleApprove = async (index: number) => {
    const updatedData = [...data];
    updatedData[index].Status_Name = 'อนุมัติ';  // เปลี่ยนสถานะเป็น 'อนุมัติ'

    const bookingId = updatedData[index].Booking_ID; // รับ Booking_ID จาก state

    if (!bookingId) {
      console.error('Booking ID is missing');
      return;
    }

    try {
      const response = await fetch(`/api/bookingrooms/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Status_Name: 'อนุมัติ', // ส่ง Status_Name ใน body ของคำขอ
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const result = await response.json();
      console.log('API response:', result);

      if (result.success) {
        // อัปเดตสถานะใน state เมื่อการอัปเดตสำเร็จ
        const updatedBookingRooms = data.map(item =>
          item.Booking_ID === bookingId
            ? { ...item, Status_Name: 'อนุมัติ' }
            : item
        );
        setData(updatedBookingRooms); // อัปเดต state ด้วยข้อมูลใหม่ที่มีการเปลี่ยนแปลง
      } else {
        console.error('Failed to update status:', result.error);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  return (
    <PageContainer title="อนุมัติคำขอ" description="อนุมัติคำขอ">
      <DashboardCard title="อนุมัติคำขอ">
        <Typography>ห้องประชุม</Typography>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>วันที่</strong></TableCell>
                <TableCell><strong>เวลา</strong></TableCell>
                <TableCell><strong>รายการที่จอง</strong></TableCell>
                <TableCell><strong>เรื่อง / สถานที่ติดต่อ</strong></TableCell>
                <TableCell><strong>หน่วยงานที่จอง</strong></TableCell>
                <TableCell><strong>จำนวนคน</strong></TableCell>
                <TableCell align="center"><strong>ดำเนินการ</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((booking, index) => (
                <TableRow key={booking.Booking_ID}>
                  <TableCell>{formatDateRange(booking.Start_date, booking.End_date)}</TableCell>
                  <TableCell>{formatTime(booking.Start_Time)} - {formatTime(booking.End_Time)}</TableCell>
                  <TableCell>{booking.Room_Name}</TableCell>

                  <TableCell
                    sx={{
                      whiteSpace: 'nowrap',   // ห้ามขึ้นบรรทัดใหม่
                      overflow: 'hidden',     // ซ่อนข้อความที่เกินขอบเขต
                      textOverflow: 'ellipsis',  // แสดง ... ถ้าข้อความยาวเกิน
                      maxWidth: '200px',      // กำหนดความกว้างสูงสุดของเซลล์
                    }}
                  >
                    {booking.Event_Name}

                    </TableCell>
                  <TableCell>{booking.Department_Name}</TableCell>
                  <TableCell align="center">{booking.participant}</TableCell>
                  <TableCell align="center">
                    {booking.Status_Name !== 'อนุมัติ' && (
                      <Button
                        color="success"
                        size="small"
                        variant="contained"
                        startIcon={<Check />}
                        onClick={() => handleApprove(index)}
                        href='http://localhost:3000/utilities/adminApprove'
                      >
                        อนุมัติ
                      </Button>
                    )}
                    {booking.Status_Name !== 'อนุมัติ' && (
                      <Button
                        color="error"
                        size="small"
                        variant="contained"
                        startIcon={<Close />}

                      >
                        ไม่อนุมัติ
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardCard>
    </PageContainer>
  );
};

export default adminApprove;
