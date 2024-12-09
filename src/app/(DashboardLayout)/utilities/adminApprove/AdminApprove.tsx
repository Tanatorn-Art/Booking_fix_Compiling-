'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import {TableContainer} from '@mui/material';
import SpinnerIcon from '@rsuite/icons/Spinner';
import { HStack } from 'rsuite';
import { useRouter } from 'next/router';

const Typography = dynamic(() => import('@mui/material').then(mod => mod.Typography), { ssr: false, loading: () => <HStack>{<SpinnerIcon spin style={{ fontSize: '1.5em', marginRight: '5px' }} />} Loading Typography...</HStack> });
const Table = dynamic(() => import('@mui/material').then(mod => mod.Table), { ssr: false, loading: () => <HStack>{<SpinnerIcon spin style={{ fontSize: '1.5em', marginRight: '5px' }} />} Loading Table...</HStack> });
const TableHead = dynamic(() => import('@mui/material').then(mod => mod.TableHead), { ssr: false, loading: () => <HStack>{<SpinnerIcon spin style={{ fontSize: '1.5em', marginRight: '5px' }} />} Loading TableHead...</HStack> });
const TableBody = dynamic(() => import('@mui/material').then(mod => mod.TableBody), { ssr: false, loading: () => <HStack>{<SpinnerIcon spin style={{ fontSize: '1.5em', marginRight: '5px' }} />} Loading TableBody...</HStack> });
const TableRow = dynamic(() => import('@mui/material').then(mod => mod.TableRow), { ssr: false, loading: () => <HStack>{<SpinnerIcon spin style={{ fontSize: '1.5em', marginRight: '5px' }} />} Loading TableRow...</HStack> });
const TableCell = dynamic(() => import('@mui/material').then(mod => mod.TableCell), { ssr: false, loading: () => <HStack>{<SpinnerIcon spin style={{ fontSize: '1.5em', marginRight: '5px' }} />} Loading TableCell...</HStack> });
const Paper = dynamic(() => import('@mui/material').then(mod => mod.Paper), { ssr: false, loading: () => <HStack>{<SpinnerIcon spin style={{ fontSize: '1.5em', marginRight: '5px' }} />} Loading Paper...</HStack> });
const Button = dynamic(() => import('@mui/material').then(mod => mod.Button), { ssr: false, loading: () => <HStack>{<SpinnerIcon spin style={{ fontSize: '1.5em', marginRight: '5px' }} />} Loading Button...</HStack> });
const PageContainer = dynamic(() => import('@/app/(DashboardLayout)/components/dashboard/PageContainer'), { ssr: false, loading: () => <HStack>{<SpinnerIcon spin style={{ fontSize: '1.5em', marginRight: '5px' }} />} Loading PageContainer...</HStack> });
const Check = dynamic(() => import('@mui/icons-material').then(mod => mod.Check), { ssr: false, loading: () => <HStack>{<SpinnerIcon spin style={{ fontSize: '1.5em', marginRight: '5px' }} />} Loading Check...</HStack> });
const Close = dynamic(() => import('@mui/icons-material').then(mod => mod.Close), { ssr: false, loading: () => <HStack>{<SpinnerIcon spin style={{ fontSize: '1.5em', marginRight: '5px' }} />} Loading Close...</HStack> });

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

const AdminApprove: React.FC<BookingDetailsProps> = ({ bookingId }) => {
  const [data, setData] = useState<BookingRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/bookingrooms/${bookingId}`);
        if (!response.ok) throw new Error('Network response was not ok');
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
    const bookingId = data[index]?.Booking_ID;
    if (!bookingId) return;

    try {
      const response = await fetch(`/api/bookingrooms/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Status_Name: 'อนุมัติ' }),
      });
      if (!response.ok) throw new Error('Failed to update status');

      setData(prev =>
        prev.map(item =>
          item.Booking_ID === bookingId
            ? { ...item, Status_Name: 'อนุมัติ' }
            : item
        )
      );
      router.push('/utilities/adminApprove');
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <PageContainer title="อนุมัติคำขอ" description="อนุมัติคำขอ">
      <Typography>ห้องประชุม</Typography>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>วันที่</strong>
              </TableCell>
              <TableCell>
                <strong>เวลา</strong>
              </TableCell>
              <TableCell>
                <strong>รายการที่จอง</strong>
              </TableCell>
              <TableCell>
                <strong>เรื่อง / สถานที่ติดต่อ</strong>
              </TableCell>
              <TableCell>
                <strong>หน่วยงานที่จอง</strong>
              </TableCell>
              <TableCell>
                <strong>จำนวนคน</strong>
              </TableCell>
              <TableCell align="center">
                <strong>ดำเนินการ</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((booking, index) => (
              <TableRow key={booking.Booking_ID}>
                <TableCell>
                  {formatDateRange(booking.Start_date, booking.End_date)}
                </TableCell>
                <TableCell>
                  {formatTime(booking.Start_Time)} -{' '}
                  {formatTime(booking.End_Time)}
                </TableCell>
                <TableCell>{booking.Room_Name}</TableCell>
                <TableCell
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '200px',
                  }}
                >
                  {/* <Tooltip title={booking.Event_Name}>
                    <span>{booking.Event_Name}</span>
                  </Tooltip> */}
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
    </PageContainer>
  );
};

export default AdminApprove;
