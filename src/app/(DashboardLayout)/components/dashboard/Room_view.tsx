import { useState, useEffect } from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Chip } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/dashboard/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import Calendar from 'rsuite/Calendar';
const App = () => <Calendar bordered />;
import ReactDOM from 'react-dom';
import { HStack } from 'rsuite';
// (Optional) Import component styles. If you are using Less, import the `index.less` file.
import 'rsuite/Calendar/styles/index.css';
import PieChartIcon from '@rsuite/icons/PieChart';
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

const Bookingrooms = () => {
  const [data, setData] = useState<BookingRoom[]>([]); // กำหนด Type ให้ state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/bookingrooms/'); // ดึงข้อมูลจาก API
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

  // ฟังก์ชันจัดรูปแบบวันที่ในรูปแบบ dd/MM/yyyy
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate); // แปลงเป็น Date object
    const day = String(date.getDate()).padStart(2, '0'); // เพิ่ม 0 หน้าเมื่อวันที่น้อยกว่า 10
    const month = String(date.getMonth() + 1).padStart(2, '0'); // เดือนเริ่มต้นจาก 0 (มกราคมคือ 0)
    const year = date.getFullYear(); // ปีเต็ม
    return `${day}/${month}/${year}`; // คืนค่าตามรูปแบบ dd/MM/yyyy
  };
  const ChartIcon = ({ color }) => (
    <PieChartIcon style={{ color, marginRight: 2, marginLeft: 10, fontSize: '16px' }} />
  );
  // ฟังก์ชันจัดรูปแบบเวลา
  const formatTime = (time: string) => time.slice(0, 5); // ตัดวินาที .00 ออก

  // ฟังก์ชันจัดการวันที่เริ่มต้นและวันที่สิ้นสุด
  const formatDateRange = (startDate: string, endDate: string) => {
    const startFormatted = formatDate(startDate);
    const endFormatted = formatDate(endDate);
    return `${startFormatted} - ${endFormatted}`; // แสดงช่วงวันที่
  };

  // ฟังก์ชันกรองข้อมูลที่มีวันที่ตรงกับวันที่ปัจจุบัน
  const filterCurrentDateBookings = (bookings: BookingRoom[]) => {
    const currentDate = new Date();
    const formattedCurrentDate = formatDate(currentDate.toISOString()); // แปลงวันที่ปัจจุบันให้เป็นรูปแบบ dd/MM/yyyy

    return bookings.filter(booking => {
      const bookingStartDate = formatDate(booking.Start_date);
      return bookingStartDate === formattedCurrentDate; // กรองแสดงข้อมูลเฉพาะวันที่ปัจจุบัน
    });
  };

  // ฟังก์ชันแสดงวันที่ปัจจุบันในรูปแบบ dd/MM/yyyy
  const getCurrentDate = () => {
    const currentDate = new Date();
    return formatDate(currentDate.toISOString());
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredData = filterCurrentDateBookings(data); // กรองข้อมูลที่มีวันที่ตรงกับวันนี้

  return (
    <PageContainer title="Sample Page" description="This is a sample page">
        {/* แสดงวันที่ปัจจุบันที่หัวตาราง */}

        <TableContainer

          component={Paper}
          sx={{
            marginTop: 2,
            maxHeight: '400px', // Adjust this value as needed
            overflowY: 'auto', // Enable vertical scrolling
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>วันที่</strong></TableCell>
                <TableCell><strong>เวลา</strong></TableCell>
                <TableCell><strong>รายการที่จอง</strong></TableCell>
                <TableCell><strong>เรื่อง / สถานที่ติดต่อ</strong></TableCell>
                <TableCell><strong>หน่วยงานที่จอง</strong></TableCell>
                <TableCell><strong>จำนวนคน</strong></TableCell>
                <TableCell align="center"><strong>สถานะ</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((booking, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDateRange(booking.Start_date, booking.End_date)}</TableCell>
                  <TableCell>
                    {formatTime(booking.Start_Time)} - {formatTime(booking.End_Time)}
                  </TableCell>
                  <TableCell>{booking.Room_Name}</TableCell>
                  <TableCell>{booking.Event_Name}</TableCell>
                  <TableCell>{booking.Department_Name}</TableCell>
                  <TableCell align="center">{booking.participant}</TableCell>
                  <TableCell align="center">
                    <Chip
                      sx={{
                        px: "10px",
                        backgroundColor: booking.Status_Name === "อนุมัติ" ? "success.main" : "error.main",
                        color: "#fff",
                      }}
                      size="small"
                      label={booking.Status_Name}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <br />
        <br />

    </PageContainer>
  );
};

export default Bookingrooms;
