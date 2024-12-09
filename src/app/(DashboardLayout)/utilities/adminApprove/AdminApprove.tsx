'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { fetchBookingData } from './fetchBookingData';
import { TableContainer } from '@mui/material';

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

// Dynamic import สำหรับ MUI Components
const Table = dynamic(() => import('@mui/material/Table'), { ssr: false });
const TableHead = dynamic(() => import('@mui/material/TableHead'), { ssr: false });
const TableBody = dynamic(() => import('@mui/material/TableBody'), { ssr: false });
const TableRow = dynamic(() => import('@mui/material/TableRow'), { ssr: false });
const TableCell = dynamic(() => import('@mui/material/TableCell'), { ssr: false });
const Paper = dynamic(() => import('@mui/material/Paper'), { ssr: false });
const Button = dynamic(() => import('@mui/material/Button'), { ssr: false });
const Typography = dynamic(() => import('@mui/material/Typography'), { ssr: false });

interface AdminApproveProps {
  bookingId: string;
}

const AdminApprove: React.FC<AdminApproveProps> = ({ bookingId }) => {
  const [data, setData] = useState<BookingRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const bookingData = await fetchBookingData(bookingId);
        if (bookingData.length === 0) throw new Error('ไม่มีข้อมูลการจอง');
        setData(bookingData);
      } catch (err: any) {
        setError(err.message || 'เกิดข้อผิดพลาด');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bookingId]);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleApprove = async (index: number) => {
    const booking = data[index];

    try {
      const response = await fetch(`/api/bookingrooms/${booking.Booking_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Status_Name: 'อนุมัติ' }),
      });

      if (!response.ok) {
        throw new Error('ไม่สามารถอัปเดตสถานะได้');
      }

      // อัปเดตสถานะใน State
      const updatedData = [...data];
      updatedData[index].Status_Name = 'อนุมัติ';
      setData(updatedData);
    } catch (error) {
      console.error('Error updating status:', error);
      setError('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        อนุมัติคำขอ
      </Typography>
      <TableContainer component={Paper as React.ElementType}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>วันที่</strong></TableCell>
              <TableCell><strong>เวลา</strong></TableCell>
              <TableCell><strong>รายการที่จอง</strong></TableCell>
              <TableCell><strong>เรื่อง</strong></TableCell>
              <TableCell><strong>สถานะ</strong></TableCell>
              <TableCell><strong>การจัดการ</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((booking, index) => (
              <TableRow key={booking.Booking_ID}>
                <TableCell>{formatDate(booking.Start_date)}</TableCell>
                <TableCell>{`${booking.Start_Time} - ${booking.End_Time}`}</TableCell>
                <TableCell>{booking.Room_Name}</TableCell>
                <TableCell>{booking.Event_Name}</TableCell>
                <TableCell>{booking.Status_Name}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    disabled={booking.Status_Name === 'อนุมัติ'}
                    onClick={() => handleApprove(index)}
                  >
                    {booking.Status_Name === 'อนุมัติ' ? 'อนุมัติแล้ว' : 'อนุมัติ'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminApprove;
