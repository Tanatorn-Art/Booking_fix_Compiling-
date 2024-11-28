import { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, IconButton } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/dashboard/PageContainer';
import { HStack } from 'rsuite';
import PieChartIcon from '@rsuite/icons/PieChart';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface BookingRoom {
  Start_date: string;
  End_date: string;
  Start_Time: string;
  End_Time: string;
  Room_Name: string;
  Event_Name: string;
  Department_Name: string;
  participant: string;
  Status_Name: string;
  Booking_ID: number;  // เพิ่ม Booking_ID เพื่อใช้ในการแก้ไขหรือลบ
}

const UserReserved = () => {
  const [data, setData] = useState<BookingRoom[]>([]); // กำหนด Type ให้ state
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState<string | null>(null); // ใช้สำหรับเก็บ User_ID จาก localStorage

  // ดึง User_ID จาก localStorage
  useEffect(() => {
    const storedUserID = localStorage.getItem('username'); // ดึงค่า username จาก localStorage
    console.log('User ID from localStorage:', storedUserID); // ตรวจสอบค่า userID ที่ได้จาก localStorage
    setUserID(storedUserID); // ตั้งค่าตัวแปร userID จาก localStorage
  }, []);

  // ดึงข้อมูลจาก API ตาม User_ID
  useEffect(() => {
    if (userID) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/userbooking?User_ID=${userID}`);
          const result = await response.json();
          console.log('Fetched Data:', result);  // ดูผลลัพธ์ที่ตอบกลับ
          if (result.success && Array.isArray(result.meetingRooms)) {
            setData(result.meetingRooms);
          } else {
            console.log('No data found for User_ID:', userID);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [userID]);

  // ฟังก์ชันจัดรูปแบบเวลา
  const formatTime = (time: string) => time.slice(0, 5); // ตัดวินาที .00 ออก
  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  // ฟังก์ชันสำหรับการแก้ไข
  const handleEdit = (id: number) => {
    console.log('Editing booking with ID:', id);
    // เพิ่มฟังก์ชันการแก้ไขที่นี่ (เช่น การเปิด modal หรือการนำไปยังหน้าจอแก้ไข)
  };

  // ฟังก์ชันสำหรับการลบ
  const handleDelete = (id: number) => {
    console.log('Deleting booking with ID:', id);
    // เพิ่มฟังก์ชันการลบที่นี่ (เช่น การส่งคำขอลบไปยัง API)
  };

  // ถ้ายังโหลดข้อมูลไม่เสร็จ
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <PageContainer title="User Reservations" description="This is the page displaying user reservations">
      <div>

        <HStack spacing={10}>

          {/* แสดง PieChartIcon ตามสถานะ */}
          <PieChartIcon style={{ color: '#f5a623', marginRight: 2, marginLeft: 10, fontSize: '16px' }}/>
          <span style={{ color: '#f5a623' }}>รออนุมัติ</span>

          <PieChartIcon style={{ color: 'green', marginRight: 2, marginLeft: 10, fontSize: '16px' }} />
          <span style={{ color: 'green' }}>อนุมัติแล้ว</span>
        </HStack>
      </div>

      <TableContainer component={Paper} sx={{ marginTop: 2, maxHeight: '400px', overflowY: 'auto' }}>
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
              <TableCell align="center"><strong>จัดการ</strong></TableCell> {/* เพิ่มคอลัมน์สำหรับปุ่มจัดการ */}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length > 0 ? (
              data.map((booking, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDate(booking.Start_date)} - {formatDate(booking.End_date)}</TableCell>
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


                  <TableCell
                    sx={{
                      whiteSpace: 'nowrap',   // ห้ามขึ้นบรรทัดใหม่
                      overflow: 'hidden',     // ซ่อนข้อความที่เกินขอบเขต
                      textOverflow: 'ellipsis',  // แสดง ... ถ้าข้อความยาวเกิน
                      maxWidth: '200px',      // กำหนดความกว้างสูงสุดของเซลล์
                    }}
                  >
                    {booking.Department_Name}
                    </TableCell>

                  <TableCell align="center">{booking.participant}</TableCell>
                  <TableCell align="center">
                    {/* แสดง PieChartIcon ตามสถานะของการจอง */}
                    {booking.Status_Name === 'Pending' ? (
                      <PieChartIcon style={{ color: '#f5a623', fontSize: '16px' }} />
                    ) : (
                      <PieChartIcon style={{ color: 'green', fontSize: '16px' }} />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleEdit(booking.Booking_ID)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(booking.Booking_ID)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">ไม่พบข้อมูลการจอง</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
};

export default UserReserved;
